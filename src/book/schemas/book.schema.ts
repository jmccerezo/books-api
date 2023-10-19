import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/schemas/user.schema';

export enum Category {
  ADVENTURE = 'Adventure',
  BIOGRAPHY = 'Biography',
  CLASSICS = 'Classics',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
  FICTION = 'Fiction',
  HISTORICAL = 'Historical',
  HORROR = 'Horror',
  MYSTERY = 'Mystery',
  POETRY = 'Poetry',
  ROMANCE = 'Romance',
  THRILLER = 'Thriller',
}

@Schema({
  timestamps: true,
})
export class Book {
  @ApiProperty({ example: 'Book Title' })
  @Prop()
  title: string;

  @ApiProperty({ example: 'Book Description' })
  @Prop()
  description: string;

  @ApiProperty({ example: 'Book Author' })
  @Prop()
  author: string;

  @ApiProperty({ example: 100 })
  @Prop()
  price: number;

  @ApiProperty({ example: 'Adventure', enum: Category })
  @Prop()
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const BookSchema = SchemaFactory.createForClass(Book);
