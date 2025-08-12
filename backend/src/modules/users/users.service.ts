import { EntityManager, SqlEntityRepository } from '@mikro-orm/sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: SqlEntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async create(name: string, email: string, password: string) {
    const user = this.userRepo.create({
      name,
      email,
      password,
      createdAt: new Date(),
    });
    await this.em.persistAndFlush(user);
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ email });
  }
}
