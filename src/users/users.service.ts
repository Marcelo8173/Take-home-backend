import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserCreateDTO } from './DTOs/UserCreateDTO';
import { User } from './user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './DTOs/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  public async createUserService(user: UserCreateDTO): Promise<User> {
    const userExist = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (userExist) {
      throw new BadRequestException('user alred exist');
    }

    const newUser = this.userRepository.create(user);
    const usersave = await this.userRepository.save(newUser);

    await this.cacheManager.set(`user:${usersave.id}`, usersave, 10000);

    return usersave;
  }

  public async listAllUserService(): Promise<User[]> {
    const cachedUsers = await this.cacheManager.get<User[]>('all_users');

    if (cachedUsers) {
      return cachedUsers;
    }

    const users = await this.userRepository.find();

    await this.cacheManager.set('all_users', users, 10000);
    return users;
  }

  public async listAllUserByIdService(id: string): Promise<User> {
    const cachedUser = await this.cacheManager.get<User>(`user:${id}`);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  public async updateUserService(
    id: string,
    user: UpdateUserDto,
  ): Promise<User> {
    const userExist = await this.userRepository.preload({
      id,
      ...user,
    });
    if (!userExist) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.save(userExist);
  }

  public async deleteUserSerivce(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id });
  }
}
