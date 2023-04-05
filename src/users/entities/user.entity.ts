import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import {List} from "../../lists/entities/list.entity";

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, {
    description: 'Id of user field',
  })
  id: string;

  @Column('text')
  @Field(() => String, {
    description: 'FullName user field',
  })
  fullName: string;

  @Field(() => String, {
    description: 'Email user field',
  })
  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Field(() => [String], {
    description: 'Roles user field',
    defaultValue: ['user'],
  })
  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @Field(() => Boolean, {
    description: 'Active user field',
    defaultValue: true,
  })
  @Column('boolean', { default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy: User;

  @OneToMany(() => Item, (item) => item.user, { cascade: true })
  @Field(() => [Item], { nullable: true })
  items: Item[];

  @OneToMany(() => List, (lists) => lists.user, { cascade: true, lazy: true })
  @Field(() => [List], { nullable: true })
  lists: List[];
}
