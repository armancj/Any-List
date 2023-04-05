import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      //forbidNonWhitelisted: true, NOt in graphQl
    }),
  );
  await app.listen(process.env.PORT);
  console.log(`Server executed in url: ${await app.getUrl()}`);
}
bootstrap().finally();
