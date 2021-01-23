import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app.module';
import { DocumentationService } from './documentation/documentation.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix(config.get('api.prefix'));

  DocumentationService.getInstance(app);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  const { port } = config.get('server');
  await app.listen(port);
}
bootstrap();
