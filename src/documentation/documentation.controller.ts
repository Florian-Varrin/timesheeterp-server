import { Controller, Get, Render, Res } from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('')
@ApiTags('documentation')
export class DocumentationController {
  @Get('documentation')
  @ApiOperation({ summary: 'See swagger UI documentation' })
  // for documentation purpose only
  index() {}

  @Get('documentation.json')
  @ApiOperation({ summary: 'Get OpenApi documentation as JSON' })
  getJson(@Res() res: Response) {
    const documentationService = DocumentationService.getInstance();

    const path = documentationService.jsonPath;

    res.sendFile(path);
  }

  @Get('documentation.yaml')
  @ApiOperation({ summary: 'Get OpenApi documentation as YAML' })
  getYaml(@Res() res: Response) {
    const documentationService = DocumentationService.getInstance();

    const path = documentationService.yamlPath;

    res.sendFile(path);
  }
}
