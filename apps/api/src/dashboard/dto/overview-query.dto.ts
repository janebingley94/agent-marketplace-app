import { IsIn, IsOptional, IsString } from 'class-validator';

export class OverviewQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['7d', '30d', '90d'])
  range?: '7d' | '30d' | '90d';
}
