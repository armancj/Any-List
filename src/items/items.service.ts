import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ILike, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { handleDBExceptions } from '../common/util/handle_error.function';
import { PaginationArgs } from '../common/dtos/pagination.args';
import { SearchArgs } from '../common/dtos/search.args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User) {
    const createItem = await this.itemRepository.create({
      ...createItemInput,
      user,
    });
    return this.itemRepository.save(createItem).catch((err) => {
      handleDBExceptions(err);
    });
  }

  findAll(user: User, paginationArgs: PaginationArgs, searchArgs?: SearchArgs) {
    const { search } = searchArgs;
    const { offset, limit } = paginationArgs;
    const searchToItem = search ? { name: ILike(`%${search}%`) } : undefined;

    return this.itemRepository.find({
      where: { user: { id: user.id }, ...searchToItem },
      take: limit,
      skip: offset,
    });

    /*const queryBuilder = this.itemRepository
      .createQueryBuilder('item')
      .take(limit)
      .offset(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search)
      queryBuilder.andWhere('item.name Ilike :name', { name: `%${search}%` });
    return queryBuilder.getMany();*/
  }

  async findOne(id: string, user: User) {
    const findOneItem = await this.itemRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!findOneItem) throw new NotFoundException('Item not Found');
    return findOneItem;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user);
    const itemToUpdate = await this.itemRepository.preload({
      ...updateItemInput,
      user,
    });
    return this.itemRepository.save(itemToUpdate);
  }

  async remove(id: string, user: User): Promise<Item> {
    const itemToRemove = await this.findOne(id, user);
    return await this.itemRepository.remove(itemToRemove);
  }

  itemCountByUser(user: User): Promise<number> {
    return this.itemRepository.countBy({ user: { id: user.id } });
  }
}
