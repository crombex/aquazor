import { RegisterUserDTO } from '../users/dto/register-user.dto';
import { Roles } from '../users/users.types';

export interface TUserInRequest {
  sub: string;
  roles?: Roles[];
  sid: string;
}

export type TRegisterData = Omit<RegisterUserDTO, 'password'> & {
  passwordHash: string;
};

export type TLoginData = {
  emailOrNickname: string;
  passwordHash: string;
};
