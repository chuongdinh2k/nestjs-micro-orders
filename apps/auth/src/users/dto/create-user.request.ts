import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 17)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 17)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
