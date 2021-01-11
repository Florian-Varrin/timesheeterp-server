import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.get('api.prefix'));

  const { port } = config.get('server');
  await app.listen(port);
}
bootstrap();
