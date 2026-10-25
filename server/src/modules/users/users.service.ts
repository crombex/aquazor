import { Injectable, NotFoundException } from '@nestjs/common';
import { TRegisterData } from '../auth/auth.types';
import { UsersRepository } from './users.repository';
import { mapKeysToCamelCase } from '../../common/utils/change-case';
import { UserEntity } from './users.types';
import { TUserEntityMapped, TUserFindOptions } from './users.types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private mapRoles(roles: string) {
    return roles.split(';').filter(Boolean);
  }

  private removeSensitiveFields(user: UserEntity) {
    return {
      id: user.id,
      roles: user.roles,
      email: user.email,
      avatarUrl: user.avatarUrl,
      coins: user.coins,
      specialCoins: user.specialCoins,
      registeredAt: user.registeredAt,
      birthdate: user.birthdate,
      experience: user.experience,
      nickname: user.nickname,
    } as TUserEntityMapped;
  }

  createUser(registerInfo: TRegisterData) {
    return this.usersRepository.createUser(registerInfo);
  }

  async findOneByEmail(
    email: string,
    options: TUserFindOptions = { includeSensitiveData: false },
  ): Promise<TUserEntityMapped | UserEntity> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user !== null) {
      const userMappedFull = {
        ...mapKeysToCamelCase<UserEntity>(user),
        roles: this.mapRoles(user.roles),
      } as UserEntity;
      if (options.includeSensitiveData) {
        return userMappedFull;
      } else {
        return this.removeSensitiveFields(userMappedFull);
      }
    } else {
      throw new NotFoundException('User with this email does not exist');
    }
  }

  async findOneByNickname(
    nickname: string,
    options: TUserFindOptions = { includeSensitiveData: false },
  ): Promise<TUserEntityMapped | UserEntity> {
    const user = await this.usersRepository.findOneBy({ nickname });
    if (user !== null) {
      const userMappedFull = {
        ...mapKeysToCamelCase<UserEntity>(user),
        roles: this.mapRoles(user.roles),
      } as UserEntity;
      if (options.includeSensitiveData) {
        return userMappedFull;
      } else {
        return this.removeSensitiveFields(userMappedFull);
      }
    } else {
      throw new NotFoundException('User with this nickname does not exist');
    }
  }

  async findOneByEmailOrNickname(
    emailOrNickname: string,
    options: TUserFindOptions = { includeSensitiveData: false },
  ): Promise<TUserEntityMapped | UserEntity> {
    let foundUser: TUserEntityMapped | UserEntity;
    try {
      foundUser = await this.findOneByEmail(emailOrNickname, {
        includeSensitiveData: options.includeSensitiveData,
      });
    } catch {
      try {
        foundUser = await this.findOneByNickname(emailOrNickname, {
          includeSensitiveData: options.includeSensitiveData,
        });
      } catch {
        throw new NotFoundException(
          'User with this email/nickname does not exists',
        );
      }
    }
    return foundUser;
  }

  async findOneById(
    id: string,
    options: TUserFindOptions = { includeSensitiveData: false },
  ): Promise<TUserEntityMapped | UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user !== null) {
      const userMappedFull = {
        ...mapKeysToCamelCase<UserEntity>(user),
        roles: this.mapRoles(user.roles),
      } as UserEntity;
      if (options.includeSensitiveData) {
        return userMappedFull;
      } else {
        return this.removeSensitiveFields(userMappedFull);
      }
    } else {
      throw new NotFoundException('User with this id does not exist');
    }
  }
}
