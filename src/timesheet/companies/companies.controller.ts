import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorators/get-users.decorator';
import { User } from '../../auth/users/entities/user.entity';
import { Company } from './entities/company.entity';

@Controller('companies')
@UseGuards(AuthGuard())
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(
    @Body(ValidationPipe) createCompanyDto: CreateCompanyDto,
    @GetUser() user: User,
  ): Promise<Company> {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  findAll(@GetUser() user: User): Promise<Company[]> {
    return this.companiesService.findAll(user);
  }

  @Get(':companyId')
  findOne(
    @Param('companyId') companyId: string,
    @GetUser() user: User,
  ): Promise<Company> {
    return this.companiesService.findOne(+companyId, user);
  }

  @Patch(':companyId')
  update(
    @Param('companyId') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetUser() user: User,
  ): Promise<Company> {
    return this.companiesService.update(+companyId, updateCompanyDto, user);
  }

  @Delete(':companyId')
  @HttpCode(204)
  remove(
    @Param('companyId') companyId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.companiesService.remove(+companyId, user);
  }
}
