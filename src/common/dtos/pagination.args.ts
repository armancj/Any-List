import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  offset = 0;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsPositive()
  @IsOptional()
  @IsInt()
  limit = 10;
}
