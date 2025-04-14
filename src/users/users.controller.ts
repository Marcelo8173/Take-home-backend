import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserCreateDTO } from './DTOs/UserCreateDTO';
import { User } from './user.entity';
import { UserService } from './users.service';
import { UpdateUserDto } from './DTOs/UpdateUserDto';
import { DeleteResult } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(@Body() user: UserCreateDTO): Promise<User> {
    return await this.userService.createUserService(user);
  }

  @Get()
  public async listAllUser(): Promise<User[]> {
    return await this.userService.listAllUserService();
  }

  @Get('/:id')
  public async listAllUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.listAllUserByIdService(id);
  }

  @Put('/:id')
  public async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUserService(id, updateUserDto);
  }

  @Delete('/:id')
  public async deleteByUser(@Param('id') id: string): Promise<DeleteResult> {
    return await this.userService.deleteUserSerivce(id);
  }
}
