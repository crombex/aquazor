import { Injectable } from '@nestjs/common';
import { TRegisterData } from '../auth/auth.types';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createUser(registerInfo: TRegisterData) {
    return this.usersRepository.createUser(registerInfo);
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneByEmail(email);
  }

  findOneByNickname(nickname: string) {
    return this.usersRepository.findOneByNickname(nickname);
  }
  
  findOneByEmailOrNickname(emailOrNickname: string) {
    return this.usersRepository.findOneByEmailOrNickname(emailOrNickname)
  }

  findOneById(id: string) {
    return this.usersRepository.findOneById(id);
  }
}
