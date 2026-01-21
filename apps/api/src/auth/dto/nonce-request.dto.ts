import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

export class NonceRequestDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/)
  address: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  chainId: number;
}
