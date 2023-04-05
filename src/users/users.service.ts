import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayOverlap, FindOptionsWhere, Repository } from 'typeorm';
import { handleDBExceptions } from '../common/util/handle_error.function';
import { RolesArgs } from './dto/roles.args';
import { ItemsService } from '../items/items.service';
import { hashPassword } from '../common/util/hash-password.function';
import { PaginationArgs } from '../common/dtos/pagination.args';
import { Item } from '../items/entities/item.entity';
import { SearchArgs } from '../common/dtos/search.args';
import {ListsService} from "../lists/lists.service";
import {List} from "../lists/entities/list.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const password = hashPassword(createUserInput.password);
    const newUser = await this.userRepository.create({
      ...createUserInput,
      password,
    });
    return await this.userRepository.save(newUser).catch((err) => {
      handleDBExceptions(err);
    });
  }

  findAll(validRoles: RolesArgs, user: User) {
    const where: FindOptionsWhere<User> =
      validRoles?.roles.length !== 0
        ? {
            roles: ArrayOverlap(validRoles.roles),
          }
        : {};
    return this.userRepository
      .find({ where })
      .catch((err) => handleDBExceptions(err));
  }

  async findOne(id: string) {
    return this.userRepository
      .findOneByOrFail({ id })
      .catch((err) => handleDBExceptions(err));
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    lastUpdateBy: User,
  ) {
    const { email, fullName, roles, password } = updateUserInput;
    const findOneUser = await this.findOne(id);
    const userToUpdate: User = {
      ...findOneUser,
      email,
      fullName,
      lastUpdateBy,
    };
    if (password) userToUpdate.password = await hashPassword(password);
    if (roles) userToUpdate.roles = roles;

    return this.userRepository.save(userToUpdate).catch((err) => {
      handleDBExceptions(err);
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneByOrFail({ email }).catch(() => {
      throw new UnauthorizedException('User Invalid');
    });
  }

  async blockUser(id: string, user: User): Promise<User> {
    const findOneUser = await this.findOne(id);
    findOneUser.isActive = findOneUser.isActive !== true;
    findOneUser.lastUpdateBy = user;
    return this.userRepository
      .save(findOneUser)
      .catch((err) => handleDBExceptions(err));
  }

  totalItemByUser(user: User): Promise<number> {
    return this.itemsService.itemCountByUser(user);
  }

  getItemsByUser(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }
  totalListByUser(user: User) {
    return this.listsService.listsCountByUser(user);
  }
  getListsByUser(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }
}
