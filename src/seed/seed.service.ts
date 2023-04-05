import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { seedConstants } from './seed.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { hashPassword } from '../common/util/hash-password.function';
import { List } from '../lists/entities/list.entity';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemService } from '../list-item/list-item.service';
import { getRandomArray, randomBoolean } from '../common/util/random.function';

@Injectable()
export class SeedService {
  private readonly isProd: boolean;
  private readonly logger: Logger;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly listItemService: ListItemService,
  ) {
    this.isProd = configService.get<string>(seedConstants.STATE) === 'prod';
  }

  async executeSeed() {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run Seed in Production');
    }
    await this.clearData();
    await this.insertDataSeed();
    return true;
  }

  private async clearData() {
    await this.listItemRepository.delete({});
    await this.listRepository.delete({});
    await this.itemRepository.delete({});
    await this.userRepository.delete({});
  }

  private async insertDataSeed() {
    const users = await this.genericData(SEED_USERS, this.userRepository);
    const items = (await this.genericData(
      SEED_ITEMS,
      this.itemRepository,
      users[0].id,
    )) as List[];

    const lists = (await this.genericData(
      SEED_LISTS,
      this.listRepository,
      users[0].id,
    )) as List[];

    await this.loadListItems(lists, items);
  }

  private async genericData(
    dataOfEntity: any[],
    targetOfEntityRepo: Repository<any>,
    id?: number,
  ) {
    const createDataEntity = dataOfEntity.map((data) => {
      return targetOfEntityRepo.create({
        ...data,
        user: { id } || undefined,
        password: !id ? hashPassword(data?.password) : undefined,
      });
    });
    return await targetOfEntityRepo.save(createDataEntity).catch((err) => {
      this.logger.error(err);
    });
  }

  private async loadListItems(lists: List[], items: any[]) {
    for (const item of items) {
      await this.listItemService.create({
        completed: randomBoolean(),
        itemId: item.id,
        listId: getRandomArray(lists).id,
        quantity: Math.round(Math.random() * 10),
      });
    }
  }
}
