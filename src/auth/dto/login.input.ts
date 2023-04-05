import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType, OmitType } from '@nestjs/graphql';
import { SignUpInput } from './sign-up.input';

@InputType()
export class LoginInput extends OmitType(SignUpInput, [
  'password',
  'fullName',
] as const) {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password: string;
}
