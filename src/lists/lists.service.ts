import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dtos/pagination.args';
import { SearchArgs } from '../common/dtos/search.args';
import { handleDBExceptions } from '../common/util/handle_error.function';
import { UpdateListInput } from './dto/update-list.input';
import { CreateListInput } from './dto/create-list.input';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User) {
    const createList = await this.listRepository.create({
      ...createListInput,
      user,
    });
    return this.listRepository.save(createList).catch((err) => {
      handleDBExceptions(err);
    });
  }

  findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs) {
    const { search } = searchArgs;
    const { offset, limit } = paginationArgs;
    const searchToList = search ? { name: ILike(`%${search}%`) } : undefined;

    return this.listRepository.find({
      where: { user: { id: user.id }, ...searchToList },
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string, user: User) {
    const findOneList = await this.listRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!findOneList) throw new NotFoundException('List not Found');
    return findOneList;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User) {
    await this.findOne(id, user);
    const listToUpdate = await this.listRepository.preload({
      ...updateListInput,
      user,
    });
    return this.listRepository.save(listToUpdate);
  }

  async remove(id: string, user: User) {
    const listToRemove = await this.findOne(id, user);
    return await this.listRepository.remove(listToRemove);
  }

  listsCountByUser(user: User): Promise<number> {
    return this.listRepository.countBy({ user: { id: user.id } });
  }
}
