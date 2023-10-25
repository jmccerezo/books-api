import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Book } from './schemas/book.schema';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: Model<Book>,
  ) {}

  async createBook(book: Book, user: User): Promise<Book> {
    const data = Object.assign(book, { user: user._id });

    const newBook = await this.bookModel.create(data);

    return newBook;
  }

  async getAllBooks(user_id: string, query: any): Promise<Book[]> {
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
      .equals(user_id)
      .limit(resPerPage)
      .skip(skip);

    return books;
  }

  async getBookById(id: string): Promise<Book> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid id.');
    }

    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book does not exist.');
    }

    return book;
  }

  async updateBook(id: string, book: Book): Promise<Book> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid id.');
    }

    const updatedBook = await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
    });

    if (!updatedBook) {
      throw new NotFoundException('Book does not exist.');
    }

    return updatedBook;
  }

  async deleteBook(id: string): Promise<Book> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid id.');
    }

    const deletedBook = await this.bookModel.findByIdAndDelete(id);

    if (!deletedBook) {
      throw new NotFoundException('Book does not exist.');
    }

    return deletedBook;
  }
}
