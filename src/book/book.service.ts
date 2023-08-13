import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async createBook(book: Book, user: User): Promise<Book> {
    const data = Object.assign(book, { user: user._id });

    const newBook = await this.bookModel.create(data);

    return newBook;
  }

  async getAllBooks(user: User, query: any): Promise<Book[]> {
    const keyword = query.keyword
      ? {
          $or: [
            {
              title: {
                $regex: query.keyword,
                $options: 'i',
              },
            },
            {
              description: {
                $regex: query.keyword,
                $options: 'i',
              },
            },
            {
              author: {
                $regex: query.keyword,
                $options: 'i',
              },
            },
          ],
        }
      : {};

    const resPerPage = 25;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const books = await this.bookModel
      .find({ ...keyword })
      .where('user')
      .equals(user._id)
      .limit(resPerPage)
      .skip(skip);

    return books;
  }

  async getBookById(id: string): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }

  async updateBook(id: string, book: Book): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
  }

  async deleteBook(id: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
