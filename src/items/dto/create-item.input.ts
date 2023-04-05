import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateItemInput {
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  @IsNotEmpty()
  @Field(() => String, { description: 'name  of item' })
  name: string;

  /* @IsNumber()
  @IsPositive()
  @Field(() => Float, { description: 'quantity of item' })
  quantity: number;*/

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  @IsNotEmpty()
  @Field(() => String, {
    description: 'quantity Units of Item',
    nullable: true,
  })
  quantityUnits: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @IsNotEmpty()
  @Field(() => String, {
    description: 'quantity Units of Item',
    nullable: false,
  })
  category: string;
}
