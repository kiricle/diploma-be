import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: ['https://diploma-rust.vercel.app/'],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
