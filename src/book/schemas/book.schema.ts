import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

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
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  author: string;

  @Prop()
  price: number;

  @Prop()
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const BookSchema = SchemaFactory.createForClass(Book);
