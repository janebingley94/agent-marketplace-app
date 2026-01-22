import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { setupTelemetry } from './telemetry';

async function bootstrap() {
  setupTelemetry();
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors({
    origin: ['http://localhost:7002'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  setupSwagger(app);
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 7001);
}

bootstrap();
