import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ValidRoles } from '../../auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @Field(() => [ValidRoles], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  roles?: ValidRoles[];
}
