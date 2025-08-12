import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const exists = await this.usersService.findByEmail(email);
    if (exists) throw new Error('Email already in use');

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
}
