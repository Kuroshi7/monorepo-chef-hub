import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class AuthService {
  private invalidatedTokens: Set<string> = new Set();
  constructor(
    
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async register(name: string, email: string, password: string) {
    const exists = await this.usersService.findByEmail(email);
    if (exists) throw new Error('Email ja existe');

    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(name, email, hash);

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('nao foram encontrados usuarios com esse email');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('senha incorreta');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user, token };
  }
   isTokenInvalid(token: string): boolean {
    return this.invalidatedTokens.has(token);
  }

  async logout(token: string): Promise<{ message: string }> {
    await this.invalidateToken(token);
    return { message: 'Logged out successfully' };
  }

      async invalidateToken(token: string): Promise<void> {
    this.invalidatedTokens.add(token);
  }

 
}
