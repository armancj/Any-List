import { Injectable } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { ILike, Repository } from 'typeorm';
import { handleDBExceptions } from '../common/util/handle_error.function';
import { List } from '../lists/entities/list.entity';
import { PaginationArgs } from '../common/dtos/pagination.args';
import { SearchArgs } from '../common/dtos/search.args';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { listId, itemId, ...rest } = createListItemInput;
    const newListItem = await this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });
    return this.listItemRepository.save(newListItem).catch((err) => {
      handleDBExceptions(err);
    });
  }

  findAll(
    list: List,
    paginationArgs?: PaginationArgs,
    searchArgs?: SearchArgs,
  ) {
    const { search } = searchArgs;
    const { offset, limit } = paginationArgs;
    const searchToListItem = search
      ? { name: ILike(`%${search}%`) }
      : undefined;

    return this.listItemRepository.find({
      where: { list: { id: list.id } },
      take: limit,
      skip: offset,
    });
  }

  findOne(id: string) {
    return this.listItemRepository
      .findOneByOrFail({ id })
      .catch((err) => handleDBExceptions(err));
  }

  async update(id: string, updateListItemInput: UpdateListItemInput) {
    const { listId, itemId, ...rest } = updateListItemInput;
    const queryBuilder = this.listItemRepository
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    if (listId) queryBuilder.set({ list: { id: listId } });
    if (itemId) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();
    return this.findOne(id);
  }

  remove(id: string) {
    return `This action removes a #${id} listItem`;
  }

  countListItemByLists(list: List) {
    return this.listItemRepository.countBy({ list: { id: list.id } });
  }
}
