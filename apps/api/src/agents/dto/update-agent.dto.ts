import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
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

export class UpdateAgentDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  @ApiPropertyOptional({ example: 'Data Analyst Pro' })
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  @ApiPropertyOptional({ example: 'data-analyst-pro' })
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ example: 'Updated description' })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Analytics' })
  category?: string;

  @IsOptional()
  @Transform(({ value }) => parseStringArray(value))
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @ApiPropertyOptional({ example: ['data', 'analysis'] })
  tags?: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'https://...' })
  iconUrl?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false })
  isPrivate?: boolean;

  @IsOptional()
  @IsEnum(AgentStatus)
  @ApiPropertyOptional({ example: AgentStatus.PUBLISHED })
  status?: AgentStatus;
}
