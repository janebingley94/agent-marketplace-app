import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { OverviewQueryDto } from './dto/overview-query.dto';
import { EarningsQueryDto } from './dto/earnings-query.dto';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get dashboard overview' })
  @ApiResponse({ status: 200, description: 'Overview metrics' })
  @Get('overview')
  getOverview(@Req() request: Request, @Query() query: OverviewQueryDto) {
    const userId = (request.user as { userId: string }).userId;
    return this.dashboardService.getOverview(userId, query);
  }

  @ApiOperation({ summary: 'Get earnings trend' })
  @ApiResponse({ status: 200, description: 'Earnings trend' })
  @Get('earnings')
  getEarnings(@Req() request: Request, @Query() query: EarningsQueryDto) {
    const userId = (request.user as { userId: string }).userId;
    return this.dashboardService.getEarnings(userId, query);
  }

  @ApiOperation({ summary: 'Get agent revenue distribution' })
  @ApiResponse({ status: 200, description: 'Agent distribution' })
  @Get('agents')
  getAgents(@Req() request: Request) {
    const userId = (request.user as { userId: string }).userId;
    return this.dashboardService.getAgentDistribution(userId);
  }
}
