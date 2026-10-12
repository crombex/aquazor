import { Injectable, NotFoundException } from '@nestjs/common';
import { TRegisterData } from '../auth/auth.types';
import { UsersRepository } from './users.repository';
import { mapKeysToCamelCase } from '../../utils/change-case';
import { UserEntity } from './users.entity';
import { TUserEntityMapped } from './users.types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private mapRoles(roles: string) {
    return roles.split(';').filter(Boolean);
  }

  createUser(registerInfo: TRegisterData) {
    return this.usersRepository.createUser(registerInfo);
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (user !== null) {
      return {
        ...mapKeysToCamelCase<UserEntity>(user),
        roles: this.mapRoles(user.roles),
      } as UserEntity;
    } else {
      throw new NotFoundException('User with this email does not exist');
    }
  }

  async findOneByNickname(nickname: string) {
    const user = await this.usersRepository.findOneBy({ nickname });
    if (user !== null) {
      return {
        ...mapKeysToCamelCase<UserEntity>(user),
        roles: this.mapRoles(user.roles),
      } as UserEntity;
    } else {
      throw new NotFoundException('User with this nickname does not exist');
    }
  }

  async findOneByEmailOrNickname(emailOrNickname: string) {
    try {
      const user = await this.findOneByEmail(emailOrNickname);
      return user;
    } catch (error) {}

    try {
      const user = await this.findOneByNickname(emailOrNickname);
      return user;
    } catch (error) {}

    throw new NotFoundException(
      'User with this email/nickname does not exists',
    );
  }

  async findOneById(
    id: string,
    options: { full: boolean } = {full: false},
  ): Promise<TUserEntityMapped | UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user !== null) {
      const userMappedFull = {
        ...mapKeysToCamelCase<UserEntity>(user),
        roles: this.mapRoles(user.roles),
      };
      if (options.full) {
        return userMappedFull as UserEntity;
      } else {
        return {
          id: userMappedFull.id,
          roles: userMappedFull.roles,
          email: userMappedFull.email,
          avatarUrl: userMappedFull.avatarUrl,
          coins: userMappedFull.coins,
          specialCoins: userMappedFull.specialCoins,
          registeredAt: userMappedFull.registeredAt,
          birthdate: userMappedFull.birthdate,
          experience: userMappedFull.experience,
          nickname: userMappedFull.nickname,
        } as TUserEntityMapped;
      }
    } else {
      throw new NotFoundException('User with this id does not exist');
    }
  }
}
