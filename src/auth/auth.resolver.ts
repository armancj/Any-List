import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/sign-up.input';
import { AuthResponseType } from './types/auth-response.type';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import {ValidRoles} from "./enums/valid-roles.enum";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponseType)
  signUp(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Promise<AuthResponseType> {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthResponseType)
  login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponseType> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponseType)
  @UseGuards(JwtAuthGuard)
  async revalidateToken(
    @CurrentUser(/*[ValidRoles.admin]*/) user: User,
  ): Promise<AuthResponseType> {
    return this.authService.revalidateToken(user);
  }
}
