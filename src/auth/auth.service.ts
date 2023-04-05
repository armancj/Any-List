import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpInput } from './dto/sign-up.input';
import { AuthResponseType } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<AuthResponseType> {
    const user = await this.usersService.create(signUpInput);
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput);
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(loginInput: LoginInput): Promise<any> {
    const { password, email } = loginInput;
    const user = await this.usersService.findOneByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid User');
  }

  async validate(id: string) {
    return this.usersService.findOne(id);
  }

  revalidateToken(user: User): AuthResponseType {
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }
}
