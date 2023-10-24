import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;

  const config = new DocumentBuilder()
    .setTitle('Books API')
    .setDescription('NestJS REST API with JWT and Passport Authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule, BookModule],
  });
  SwaggerModule.setup('/', app, document, {
    customSiteTitle: 'Books API - Swagger UI',
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(port);
}
bootstrap();
