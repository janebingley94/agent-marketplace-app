import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AgentStatus } from '@prisma/client';

const parseStringArray = (value?: string | string[]): string[] | undefined => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return undefined;
};

export class AgentQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'analytics' })
  q?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Analytics' })
  category?: string;

  @IsOptional()
  @Transform(({ value }) => parseStringArray(value))
  @ApiPropertyOptional({ example: ['data', 'analysis'] })
  tags?: string[];

  @IsOptional()
  @IsEnum(AgentStatus)
  @ApiPropertyOptional({ example: AgentStatus.PUBLISHED })
  status?: AgentStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'createdAt' })
  sort?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiPropertyOptional({ example: 'desc' })
  order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 20 })
  limit?: number;
}
