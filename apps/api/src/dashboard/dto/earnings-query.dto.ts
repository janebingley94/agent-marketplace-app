import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class EarningsQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['7d', '30d', '90d'])
  @ApiPropertyOptional({ example: '30d' })
  range?: '7d' | '30d' | '90d';

  @IsOptional()
  @IsString()
  @IsIn(['day', 'week', 'month'])
  @ApiPropertyOptional({ example: 'day' })
  groupBy?: 'day' | 'week' | 'month';
}
