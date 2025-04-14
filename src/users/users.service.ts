import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    return this.userRepository.save(newUser);
  }

  public async listAllUserService(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async listAllUserByIdService(id: string): Promise<User> {
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
