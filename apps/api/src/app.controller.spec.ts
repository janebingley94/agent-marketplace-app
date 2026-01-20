import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  it('returns a welcome message from the mocked service', async () => {
    const mockService = {
      getWelcome: () => ({ message: 'Mocked' }),
      getStatus: () => ({ status: 'ok', timestamp: 'mock' }),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockService,
        },
      ],
    }).compile();

    const controller = moduleRef.get(AppController);
    expect(controller.getWelcome()).toEqual({ message: 'Mocked' });
  });
});
