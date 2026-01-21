import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AgentsService } from './agents.service';
import { AgentQueryDto } from './dto/agent-query.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @ApiOperation({ summary: 'List agents with filters' })
  @ApiResponse({ status: 200, description: 'Agent list' })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'tags', required: false, description: 'Comma-separated tags' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  listAgents(@Query() query: AgentQueryDto) {
    return this.agentsService.listAgents(query);
  }

  @ApiOperation({ summary: 'Get agent leaderboard' })
  @ApiResponse({ status: 200, description: 'Leaderboard data' })
  @ApiQuery({ name: 'metric', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get('leaderboard')
  getLeaderboard(@Query() query: LeaderboardQueryDto) {
    return this.agentsService.getLeaderboard(query);
  }

  @ApiOperation({ summary: 'Get agent details by slug' })
  @ApiResponse({ status: 200, description: 'Agent detail' })
  @Get(':slug')
  getAgent(@Param('slug') slug: string) {
    return this.agentsService.getAgentBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create agent' })
  @ApiResponse({ status: 201, description: 'Agent created' })
  @Post()
  createAgent(@Body() payload: CreateAgentDto, @Req() request: Request) {
    const userId = (request.user as { userId: string }).userId;
    return this.agentsService.createAgent(payload, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update agent' })
  @ApiResponse({ status: 200, description: 'Agent updated' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete agent' })
  @ApiResponse({ status: 200, description: 'Agent deleted' })
  @Delete(':id')
  deleteAgent(@Param('id') id: string, @Req() request: Request) {
    const userId = (request.user as { userId: string }).userId;
    return this.agentsService.deleteAgent(id, userId);
  }
}
