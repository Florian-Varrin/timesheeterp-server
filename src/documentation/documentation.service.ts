import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as config from 'config';
import * as yaml from 'json2yaml';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../package.json');

enum Tags {
  documentation = 'documentation',
  auth = 'auth',
  users = 'users',
  projects = 'projects',
  times = 'times',
}

export class DocumentationService {
  private app;
  private document;

  private static instance: DocumentationService;

  basePath: string;
  jsonPath: string;
  yamlPath: string;

  private constructor(app) {
    this.app = app;

    const { title, description } = config.get('app');
    const documentBuilder = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth()
      .addTag(Tags.documentation)
      .addTag(Tags.auth)
      .addTag(Tags.users)
      .addTag(Tags.projects)
      .addTag(Tags.times)
      .build();

    const document = SwaggerModule.createDocument(this.app, documentBuilder);
    this.document = document;

    this.basePath = join(__dirname, '..', '..', 'public', 'documentation');

    SwaggerModule.setup(
      `${config.get('api.prefix')}/documentation`,
      this.app,
      document,
    );
  }

  static getInstance(app?): DocumentationService {
    if (!DocumentationService.instance) {
      DocumentationService.instance = new DocumentationService(app);
    }

    return DocumentationService.instance;
  }

  async writeDocumentationFiles() {
    // Check synchronously because only on application startup
    if (!fsSync.existsSync(this.basePath)) {
      await fs.mkdir(this.basePath);
    }
    await this.setJson();
    await this.setYaml();
  }

  async setYaml() {
    this.yamlPath = join(this.basePath, 'openapi.yml');
    const yamlContent = yaml.stringify(this.document);

    await fs.writeFile(this.yamlPath, yamlContent);
  }

  async setJson() {
    this.jsonPath = join(this.basePath, 'openapi.json');

    await fs.writeFile(this.jsonPath, JSON.stringify(this.document));
  }
}
