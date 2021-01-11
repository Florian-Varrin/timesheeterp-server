import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyRepository } from './entities/company.repository';
import { User } from '../../auth/users/entities/user.entity';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyRepository)
    private companyRepository: CompanyRepository,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: User,
  ): Promise<Company> {
    return await this.companyRepository.createCompany(createCompanyDto, user);
  }

  async findAll(user: User): Promise<Company[]> {
    const companies = await this.companyRepository.getCompanies(user.id);

    return companies;
  }

  async findOne(id: number, user: User): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: {
        id,
        archived: false,
      },
    });

    if (!company) throw new NotFoundException('Company not found');

    if (company.user_id !== user.id)
      throw new ForbiddenException('You cannot access this company');

    delete company.archived;

    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
    user: User,
  ): Promise<Company> {
    const { name, hour_rate } = updateCompanyDto;

    const company = await this.findOne(id, user);

    if (name) company.name = name;
    if (hour_rate) company.hour_rate = hour_rate;

    await company.save();

    delete company.archived;

    return company;
  }

  async remove(id: number, user: User): Promise<void> {
    const company = await this.findOne(id, user);

    company.archived = true;
    await company.save();
  }
}
