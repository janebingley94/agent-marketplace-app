import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { NonceRequestDto } from './dto/nonce-request.dto';
import { VerifyRequestDto } from './dto/verify-request.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nonce')
  createNonce(@Body() payload: NonceRequestDto) {
    return this.authService.createNonce(payload);
  }

  @Post('verify')
  verify(@Body() payload: VerifyRequestDto) {
    return this.authService.verifySignature(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() request: Request) {
    const userId = (request.user as { userId: string }).userId;
    return this.authService.getMe(userId);
  }
}
