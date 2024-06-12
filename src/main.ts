import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const corsOptions: CorsOptions = {
    // origin: ['https://diploma-rust.vercel.app', 'http://localhost:3000'],
    // origin: '*',
    // credentials: true,
    // exposedHeaders: 'set-cookie',
    // allowedHeaders: ['Content-type', 'Accept', 'Authorization'],
    origin: 'https://diploma-rust.vercel.app', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
