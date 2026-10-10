import { Length, IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  @Length(3, 32)
  emailOrNickname!: string;

  @IsNotEmpty()
  @Length(8, 64)
  password!: string;
}
