import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.get('api.prefix'));

  const { title, description } = config.get('app');
  const documentBuilder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .addTag('auth')
    .addTag('users')
    .addTag('projects')
    .addTag('times')
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('documentation', app, document);

  const { port } = config.get('server');
  await app.listen(port);
}
bootstrap();
