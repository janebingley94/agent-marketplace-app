import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

describe('Swagger setup', () => {
  it('builds a swagger document with auth endpoints', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    const document = setupSwagger(app);

    expect(document.info.title).toBe('Agent Marketplace API');
    expect(document.paths['/auth/nonce']).toBeDefined();
    expect(document.paths['/agents']).toBeDefined();

    await app.close();
  });
});
