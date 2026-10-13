import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  birthdate!: string;

  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(3)
  @IsString()
  nickname!: string;
}
