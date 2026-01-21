import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { NonceRequestDto } from './dto/nonce-request.dto';
import { VerifyRequestDto } from './dto/verify-request.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Generate a nonce for wallet signature' })
  @ApiResponse({ status: 200, description: 'Nonce issued' })
  @Post('nonce')
  createNonce(@Body() payload: NonceRequestDto) {
    return this.authService.createNonce(payload);
  }

  @ApiOperation({ summary: 'Verify a wallet signature and return JWT' })
  @ApiResponse({ status: 200, description: 'JWT issued' })
  @Post('verify')
  verify(@Body() payload: VerifyRequestDto) {
    return this.authService.verifySignature(payload);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user' })
  @Get('me')
  getMe(@Req() request: Request) {
    const userId = (request.user as { userId: string }).userId;
    return this.authService.getMe(userId);
  }
}
