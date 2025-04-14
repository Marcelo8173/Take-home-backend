import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsEmail({}, { message: 'invalid email' })
  email: string;
}
