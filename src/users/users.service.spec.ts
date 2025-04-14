import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DeleteResult } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserCreateDTO } from './DTOs/UserCreateDTO';
import { UpdateUserDto } from './DTOs/UpdateUserDto';

describe('UserService', () => {
  let service: UserService;

  const mockUser: User = {
    id: 'uuid-mockado',
    name: 'Marcelo',
    email: 'marcelo@example.com',
  };

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('shoud be create a new user', async () => {
    mockRepository.findOne.mockResolvedValue(undefined);
    mockRepository.create.mockReturnValue(mockUser);
    mockRepository.save.mockResolvedValue(mockUser);

    const dto: UserCreateDTO = {
      name: 'Marcelo',
      email: 'marcelo@example.com',
    };

    const result = await service.createUserService(dto);
    expect(result).toEqual(mockUser);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { email: dto.email },
    });
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('not be able create a new user if exist a user', async () => {
    mockRepository.findOne.mockResolvedValue(mockUser);

    await expect(
      service.createUserService({
        name: 'Marcelo',
        email: 'marcelo@example.com',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should be able list all user', async () => {
    mockRepository.find.mockResolvedValue([mockUser]);
    const result = await service.listAllUserService();
    expect(result).toEqual([mockUser]);
  });

  it('shoudl be able list user by id', async () => {
    mockRepository.findOneBy.mockResolvedValue(mockUser);
    const result = await service.listAllUserByIdService('uuid-mockado');
    expect(result).toEqual(mockUser);
  });

  it('should throw an error if user is not found by id', async () => {
    mockRepository.findOneBy.mockResolvedValue(null);
    await expect(
      service.listAllUserByIdService('uuid-invalido'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update the user if they exist', async () => {
    const updatedUser = { ...mockUser, name: 'Atualizado' };
    mockRepository.preload.mockResolvedValue(updatedUser);
    mockRepository.save.mockResolvedValue(updatedUser);

    const dto: UpdateUserDto = {
      name: 'Atualizado',
      email: 'marceloandrebio@gmail.com',
    };

    const result = await service.updateUserService('uuid-mockado', dto);
    expect(result).toEqual(updatedUser);
    expect(mockRepository.preload).toHaveBeenCalledWith({
      id: 'uuid-mockado',
      ...dto,
    });
    expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
  });

  it('should throw an error when trying to update a non-existent user', async () => {
    mockRepository.preload.mockResolvedValue(null);
    const dto: UpdateUserDto = {
      name: 'Inexistente',
      email: 'marceloandrebio@gmail.com',
    };
    await expect(service.updateUserService('uuid-fake', dto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete a user', async () => {
    const mockDeleteResult: DeleteResult = { affected: 1, raw: [] };
    mockRepository.delete.mockResolvedValue(mockDeleteResult);
    const result = await service.deleteUserSerivce('uuid-mockado');
    expect(result).toEqual(mockDeleteResult);
  });
});
