import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Company } from './company.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { User } from '../../../auth/users/entities/user.entity';

@EntityRepository(Company)
export class CompanyRepository extends Repository<Company> {
  async getCompanies(userId: number): Promise<Company[]> {
    const query = this.createQueryBuilder('company');

    query.andWhere('company.user_id = :userId', { userId });
    query.andWhere('company.archived = false');

    const companies = await query.getMany();

    return companies.map((company) => {
      delete company.archived;

      return company;
    });
  }

  async createCompany(
    createCompanyDto: CreateCompanyDto,
    user: User,
  ): Promise<Company> {
    const { name, hour_rate } = createCompanyDto;

    const company = new Company();
    company.name = name;
    company.hour_rate = +hour_rate;
    company.user = user;
    company.archived = false;

    try {
      await company.save();

      delete company.user;
      delete company.archived;

      return company;
    } catch (err) {
      const EMAIL_DUPLICATE_ERROR_CODE = '23505';
      if (err.code === EMAIL_DUPLICATE_ERROR_CODE)
        throw new ConflictException('email already exists');

      throw new InternalServerErrorException(
        'An error as occurred while creating a company',
      );
    }
  }
}
