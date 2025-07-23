import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    origin: true, // ✅ tu frontend
    credentials: true,               // ✅ permitir cookies
  });

  const config = new DocumentBuilder()
    .setTitle('Api POS')
    .setDescription('API del punto de venta')
    .setVersion('1.0')
    .addCookieAuth('jwt')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
