import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, ConsoleLogger } from '@nestjs/common';
import { AppExceptionFilter } from './modules/app/app.exception-filter';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { cwd } from 'process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AppExceptionFilter());
  app.useLogger(new ConsoleLogger());
  app.use(cookieParser());
  app.useStaticAssets(path.join(cwd(), 'public'), { prefix: '/public' });
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap(); // eslint-disable-line @typescript-eslint/no-floating-promises
