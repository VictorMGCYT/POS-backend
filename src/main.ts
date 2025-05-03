import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,

      // ! No mostrar los campos undefined
      transformOptions: {
        exposeUnsetFields: false
      }
    })
  );

  app.use(cookieParser());

  // TODO mejorar el uso de cors para mi dominio del front en especifico
  app.enableCors({
    origin: 'http://localhost:5173', // ✅ tu frontend
    credentials: true,               // ✅ permitir cookies
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
