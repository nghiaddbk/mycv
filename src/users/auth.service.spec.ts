import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email, password) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });
  it('can create a instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('nghiadd@example.com', 'nghiadd');
    expect(user.password).not.toEqual('nghiadd');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'test@example.com', password: 'test' } as User,
      ]);

    await expect(
      service.signup('nghiadd@example.com', 'nghiadd'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throw if signin is called with an unused email', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'test@example.com', password: 'test' } as User,
      ]);
    await expect(service.signin('test@example.com', 'test')).rejects.toThrow(
      BadRequestException,
    );
  });
});
