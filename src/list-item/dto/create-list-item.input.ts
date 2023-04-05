import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Number, { nullable: true, defaultValue: 0 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity = 0;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  completed = false;

  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => ID)
  @IsUUID()
  itemId: string;
}
