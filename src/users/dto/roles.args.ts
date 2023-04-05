import { IsArray, IsOptional } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';
import { ValidRoles } from '../../auth/enums/valid-roles.enum';

@ArgsType()
export class RolesArgs {
  @Field(() => [ValidRoles], { nullable: true })
  @IsOptional()
  @IsArray()
  roles: ValidRoles[] = [];
}
