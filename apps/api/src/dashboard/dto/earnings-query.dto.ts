import { IsIn, IsOptional, IsString } from 'class-validator';

export class EarningsQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['7d', '30d', '90d'])
  range?: '7d' | '30d' | '90d';

  @IsOptional()
  @IsString()
  @IsIn(['day', 'week', 'month'])
  groupBy?: 'day' | 'week' | 'month';
}
