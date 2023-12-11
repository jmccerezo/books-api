import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../schemas/book.schema';

export class CreateBookDto {
  @ApiProperty({ example: 'Book Title' })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Book Description' })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({ example: 'Book Author' })
  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({ example: 'Adventure', enum: Category })
  @IsNotEmpty()
  @IsEnum(Category)
  readonly category: string;

  @IsEmpty({ message: 'You cannot pass user id.' })
  readonly user: undefined;
}
