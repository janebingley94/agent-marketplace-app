import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { OverviewQueryDto } from './dto/overview-query.dto';
import { EarningsQueryDto } from './dto/earnings-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview(@Req() request: Request, @Query() query: OverviewQueryDto) {
    const userId = (request.user as { userId: string }).userId;
    return this.dashboardService.getOverview(userId, query);
  }

  @Get('earnings')
  getEarnings(@Req() request: Request, @Query() query: EarningsQueryDto) {
    const userId = (request.user as { userId: string }).userId;
    return this.dashboardService.getEarnings(userId, query);
  }

  @Get('agents')
  getAgents(@Req() request: Request) {
    const userId = (request.user as { userId: string }).userId;
    return this.dashboardService.getAgentDistribution(userId);
  }
}
