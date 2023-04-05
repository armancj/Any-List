import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { RolesArgs } from './dto/roles.args';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { Item } from '../items/entities/item.entity';
import { PaginationArgs } from '../common/dtos/pagination.args';
import { SearchArgs } from '../common/dtos/search.args';
import {List} from "../lists/entities/list.entity";

@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args({ nullable: true }) validRoles: RolesArgs,
    @CurrentUser() user: User,
  ) {
    return this.usersService.findAll(validRoles, user);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.superUser]) user: User,
  ) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.superUser]) user: User,
  ) {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User)
  blockOrActiveUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.usersService.blockUser(id, user);
  }

  @Mutation(() => User)
  removeUser(
    @Args('id', { type: () => ID }) id: number,
    @CurrentUser([ValidRoles.admin]) user: User,
  ) {
    return this.usersService.remove(id);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  itemCount(@Parent() user: User): Promise<number> {
    return this.usersService.totalItemByUser(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  getItemByUser(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.usersService.getItemsByUser(user, paginationArgs, searchArgs);
  }
  @ResolveField(() => Int, { name: 'listCount' })
  listsCount(@Parent() user: User): Promise<number> {
    return this.usersService.totalListByUser(user);
  }
  @ResolveField(() => [List], { name: 'lists' })
  getListByUser(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return this.usersService.getListsByUser(user, paginationArgs, searchArgs);
  }
}
