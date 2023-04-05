import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ListItem } from '../../list-item/entities/list-item.entity';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'UUID of Item' })
  id: string;

  @Column('text')
  @Field(() => String, { description: 'name of Item' })
  name: string;

  /*@Column('integer')
  @Field(() => Float, { description: 'quantity of item' })
  quantity: number;*/

  @Column('text', { nullable: true })
  @Field(() => String, {
    description: 'quantity Units of Item',
    nullable: true,
  })
  quantityUnits?: string;

  //stores

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('user-index')
  @Field(() => User)
  user: User;

  @Column('text', { nullable: true })
  @Field(() => String, {
    description: 'category of Item',
    nullable: true,
  })
  category: string;

  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field(() => [ListItem])
  listItem: ListItem[];
}
