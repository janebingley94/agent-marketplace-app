import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

export class VerifyRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Sign in to Agent Marketplace\nNonce: abc123xyz' })
  message: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '0x...' })
  signature: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/)
  @ApiProperty({ example: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' })
  address: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  chainId: number;
}
