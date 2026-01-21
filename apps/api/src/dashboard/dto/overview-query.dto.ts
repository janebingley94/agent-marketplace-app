import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class OverviewQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['7d', '30d', '90d'])
  @ApiPropertyOptional({ example: '7d' })
  range?: '7d' | '30d' | '90d';
}
