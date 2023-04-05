import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ListItem } from '../../list-item/entities/list-item.entity';

@ObjectType()
@Entity()
export class List {
  @Field(() => ID, { description: 'Example field ID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'Example field name' })
  @Column('text')
  name: string;

  @Field(() => User, { description: 'Example field User' })
  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('user-index-lists')
  user: User;

  @Field(() => [ListItem])
  @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
  listItem: ListItem[];
}
