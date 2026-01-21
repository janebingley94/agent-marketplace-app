import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SiweMessage } from 'siwe';
import { randomBytes } from 'crypto';
import type Redis from 'ioredis';
import { PrismaService } from '../database/prisma.service';
import { REDIS_CLIENT } from '../redis/redis.constants';
import { NonceRequestDto } from './dto/nonce-request.dto';
import { VerifyRequestDto } from './dto/verify-request.dto';

const NONCE_TTL_SECONDS = 300;
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {}

  async createNonce(payload: NonceRequestDto) {
    const address = payload.address.toLowerCase();
    const nonce = randomBytes(16).toString('hex');
    const key = `nonce:${address}`;

    await this.redis.set(key, nonce, 'EX', NONCE_TTL_SECONDS);

    return {
      nonce,
      expiresAt: new Date(Date.now() + NONCE_TTL_SECONDS * 1000).toISOString(),
    };
  }

  async verifySignature(payload: VerifyRequestDto) {
    const address = payload.address.toLowerCase();
    const key = `nonce:${address}`;
    const storedNonce = await this.redis.get(key);

    if (!storedNonce) {
      throw new UnauthorizedException('Nonce expired');
    }

    let siweMessage: SiweMessage;
    try {
      siweMessage = new SiweMessage(payload.message);
    } catch (error) {
      throw new BadRequestException('Invalid message');
    }

    let verification;
    try {
      verification = await siweMessage.verify({ signature: payload.signature });
    } catch (error) {
      throw new UnauthorizedException('Invalid signature');
    }
    const verifiedNonce = verification?.data?.nonce;

    if (!verification?.success || !verifiedNonce || verifiedNonce !== storedNonce) {
      throw new UnauthorizedException('Invalid signature');
    }

    if (siweMessage.address.toLowerCase() !== address) {
      throw new BadRequestException('Address mismatch');
    }

    if (siweMessage.chainId !== payload.chainId) {
      throw new BadRequestException('Chain mismatch');
    }

    await this.redis.del(key);

    const wallet = await this.prisma.wallet.findUnique({
      where: {
        chainId_address: {
          chainId: payload.chainId,
          address,
        },
      },
      include: { user: true },
    });

    const user = wallet?.user ??
      (await this.prisma.user.create({
        data: {
          wallets: {
            create: {
              chainId: payload.chainId,
              address,
              isPrimary: true,
            },
          },
        },
      }));

    const accessToken = this.jwtService.sign({ sub: user.id });
    const expiresIn = Number(this.configService.get('JWT_EXPIRES_IN') ?? 86400);

    return {
      accessToken,
      expiresIn,
      user: {
        id: user.id,
        address,
        name: user.name ?? null,
        avatarUrl: user.avatarUrl ?? null,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallets: {
          select: {
            id: true,
            chainId: true,
            address: true,
            isPrimary: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return {
      id: user.id,
      email: user.email ?? null,
      name: user.name ?? null,
      avatarUrl: user.avatarUrl ?? null,
      wallets: user.wallets,
      createdAt: user.createdAt,
    };
  }
}
