import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AgentsService } from './agents.service';
import { AgentQueryDto } from './dto/agent-query.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  listAgents(@Query() query: AgentQueryDto) {
    return this.agentsService.listAgents(query);
  }

  @Get('leaderboard')
  getLeaderboard(@Query() query: LeaderboardQueryDto) {
    return this.agentsService.getLeaderboard(query);
  }

  @Get(':slug')
  getAgent(@Param('slug') slug: string) {
    return this.agentsService.getAgentBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createAgent(@Body() payload: CreateAgentDto, @Req() request: Request) {
    const userId = (request.user as { userId: string }).userId;
    return this.agentsService.createAgent(payload, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateAgent(
    @Param('id') id: string,
    @Body() payload: UpdateAgentDto,
    @Req() request: Request
  ) {
    const userId = (request.user as { userId: string }).userId;
    return this.agentsService.updateAgent(id, payload, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteAgent(@Param('id') id: string, @Req() request: Request) {
    const userId = (request.user as { userId: string }).userId;
    return this.agentsService.deleteAgent(id, userId);
  }
}
