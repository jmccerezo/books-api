import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../schemas/book.schema';
import { User } from '../../auth/schemas/user.schema';

export class UpdateBookDto {
  @ApiProperty({ example: 'Book Title' })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Book Description' })
  @IsOptional()
  @IsString()
  readonly description: string;

  @ApiProperty({ example: 'Book Author' })
  @IsOptional()
  @IsString()
  readonly author: string;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  readonly price: number;

  @ApiProperty({ example: 'Adventure', enum: Category })
  @IsOptional()
  @IsEnum(Category, { message: 'Please enter correct category.' })
  readonly category: string;

  @IsEmpty({ message: 'You cannot pass user id.' })
  readonly user: User;
}
