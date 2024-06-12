import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const corsOptions: CorsOptions = {
    origin: ['https://diploma-rust.vercel.app/', 'http://localhost:3000'],
    credentials: true,
    exposedHeaders: 'set-cookie',
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
