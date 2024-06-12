import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: ['https://diploma-rust.vercel.app/'],
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    exposedHeaders: 'set-cookie',
  });

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
