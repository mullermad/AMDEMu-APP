// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.enableCors({
  origin: [
    'https://am-de-mu-frontend.vercel.app',
    'http://localhost:3000', // keep this for local testing
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Required for Auth cookies/sessions
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  // Your Frontend Port
});
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(8000);
}
bootstrap();
