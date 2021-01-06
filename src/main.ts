import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('secret', config.get('jwt.secret'));
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const { port } = config.get('server');
  await app.listen(port);
}
bootstrap();
