import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { List } from '../../lists/entities/list.entity';
import { Item } from '../../items/entities/item.entity';

@Entity()
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('numeric')
  @Field(() => Number)
  quantity: number;

  @Column('boolean')
  @Field(() => Boolean)
  completed: boolean;

  @ManyToOne(() => List, (lists) => lists.listItem, { lazy: true })
  list: List;

  @ManyToOne(() => Item, (items) => items.listItem, { lazy: true })
  item: Item;
}
