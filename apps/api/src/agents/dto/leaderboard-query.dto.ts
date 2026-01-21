import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class LeaderboardQueryDto {
  @IsOptional()
  @IsIn(['revenue', 'calls'])
  @ApiPropertyOptional({ example: 'revenue' })
  metric?: 'revenue' | 'calls';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 10 })
  limit?: number;
}
