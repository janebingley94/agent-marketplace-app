import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome(): { message: string } {
    return { message: 'Agent Marketplace API' };
  }

  getStatus(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
