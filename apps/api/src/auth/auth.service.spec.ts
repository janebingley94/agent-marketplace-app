import { JwtService } from '@nestjs/jwt';
import type Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';

jest.mock('siwe', () => ({
  SiweMessage: jest.fn().mockImplementation(() => ({
    address: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
    chainId: 1,
    verify: jest.fn().mockResolvedValue({
      success: true,
      data: { nonce: 'mock-nonce' },
    }),
  })),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let redis: Redis;
  let configService: ConfigService;

  beforeEach(() => {
    prisma = {
      wallet: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
      user: {
        create: jest.fn().mockResolvedValue({
          id: 'user_1',
          name: null,
          avatarUrl: null,
        }),
        findUnique: jest.fn(),
      },
    } as unknown as PrismaService;

    jwtService = {
      sign: jest.fn().mockReturnValue('token'),
    } as unknown as JwtService;

    redis = {
      get: jest.fn().mockResolvedValue('mock-nonce'),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
    } as unknown as Redis;

    configService = {
      get: jest.fn().mockReturnValue(86400),
    } as unknown as ConfigService;

    service = new AuthService(prisma, jwtService, configService, redis);
  });

  it('creates a nonce and stores it in redis', async () => {
    const response = await service.createNonce({
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      chainId: 1,
    });

    expect(redis.set).toHaveBeenCalled();
    expect(response.nonce).toBeDefined();
    expect(response.expiresAt).toBeDefined();
  });

  it('verifies a signature and returns a token payload', async () => {
    const result = await service.verifySignature({
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      chainId: 1,
      message: 'Sign in',
      signature: '0xsignature',
    });

    expect(redis.get).toHaveBeenCalled();
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'user_1' });
    expect(result.accessToken).toBe('token');
  });
});
