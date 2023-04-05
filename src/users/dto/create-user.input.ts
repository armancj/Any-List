import { InputType } from '@nestjs/graphql';
import { SignUpInput } from '../../auth/dto/sign-up.input';

@InputType()
export class CreateUserInput extends SignUpInput {}
