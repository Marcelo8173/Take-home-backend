/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { UserCreateDTO } from './DTOs/UserCreateDTO';
import { UpdateUserDto } from './DTOs/UpdateUserDto';
import { User } from './user.entity';
import { DeleteResult } from 'typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UserService;

  const mockUser: User = {
    id: 'uuid-mockado',
    name: 'Marcelo',
    email: 'marcelo@example.com',
  };

  const mockUserService = {
    createUserService: jest.fn().mockResolvedValue(mockUser),
    listAllUserService: jest.fn().mockResolvedValue([mockUser]),
    listAllUserByIdService: jest.fn().mockResolvedValue(mockUser),
    updateUserService: jest
      .fn()
      .mockResolvedValue({ ...mockUser, name: 'Atualizado' }),
    deleteUserSerivce: jest
      .fn()
      .mockResolvedValue({ affected: 1 } as DeleteResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UserService>(UserService);
  });

  it('shoul be create a new user', async () => {
    const dto: UserCreateDTO = {
      name: 'Marcelo',
      email: 'marcelo@example.com',
    };
    expect(await controller.createUser(dto)).toEqual(mockUser);
    expect(service.createUserService).toHaveBeenCalledWith(dto);
  });

  it('should be able lista all user', async () => {
    expect(await controller.listAllUser()).toEqual([mockUser]);
  });

  it('shoubl be able return user by id', async () => {
    expect(await controller.listAllUserById('uuid-mockado')).toEqual(mockUser);
  });

  it('should be able update user', async () => {
    const dto: UpdateUserDto = {
      name: 'Atualizado',
      email: 'marceloandre@gmail.com',
    };
    expect(await controller.updateUserById('uuid-mockado', dto)).toEqual({
      ...mockUser,
      name: 'Atualizado',
    });
  });

  it('it should be able delete user', async () => {
    expect(await controller.deleteByUser('uuid-mockado')).toEqual({
      affected: 1,
    });
  });
});
