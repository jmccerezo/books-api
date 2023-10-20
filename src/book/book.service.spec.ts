import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import mongoose, { Model } from 'mongoose';
import { Book, Category } from './schemas/book.schema';
import { User } from '../auth/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let bookService: BookService;
  let bookModel: Model<Book>;

  const mockBook = {
    _id: '64dada20aa6b96af74cd6a1c',
    title: 'Book 1',
    description: 'Book 1 Description',
    author: 'Author 1',
    price: 100,
    category: Category.ADVENTURE,
    user: '64d8c9cfe874c0693be7a19a',
  };

  const mockUser = {
    _id: '64d8c9cfe874c0693be7a19a',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
  };

  const mockBookService = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: getModelToken(Book.name), useValue: mockBookService },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookModel = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('createBook', () => {
    it('should create and return a book', async () => {
      const newBook = {
        title: 'Book 1',
        description: 'Book 1 Description',
        author: 'Author 1',
        price: 100,
        category: Category.ADVENTURE,
      };

      jest
        .spyOn(bookModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockBook).then());

      const result = await bookService.createBook(
        newBook as CreateBookDto,
        mockUser as User,
      );

      expect(result).toEqual(mockBook);
    });
  });

  describe('getAllBooks', () => {
    it('should return an array of books', async () => {
      const query = { page: '1', keyword: 'test' };

      jest.spyOn(bookModel, 'find').mockImplementation(
        () =>
          ({
            where: () => ({
              equals: () => ({
                limit: () => ({
                  skip: jest.fn().mockResolvedValue([mockBook]),
                }),
              }),
            }),
          } as any),
      );

      const result = await bookService.getAllBooks(mockUser._id, query);

      expect(result).toEqual([mockBook]);
    });
  });

  describe('getBookById', () => {
    it('should return a single book', async () => {
      jest.spyOn(bookModel, 'findById').mockResolvedValue(mockBook);

      const result = await bookService.getBookById(mockBook._id);

      expect(bookModel.findById).toHaveBeenLastCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const id = 'invalid-id';

      const isValidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(bookService.getBookById(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIdMock).toHaveBeenLastCalledWith(id);
      isValidObjectIdMock.mockRestore();
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(bookModel, 'findById').mockResolvedValue(null);

      await expect(bookService.getBookById(mockBook._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(bookModel.findById).toHaveBeenLastCalledWith(mockBook._id);
    });
  });

  describe('updateBook', () => {
    it('should update and return a book', async () => {
      const updatedBook = { ...mockBook, title: 'Updated title' };
      const book = { title: 'Updated title' };

      jest.spyOn(bookModel, 'findByIdAndUpdate').mockResolvedValue(updatedBook);

      const result = await bookService.updateBook(mockBook._id, book as any);

      expect(bookModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockBook._id,
        book,
        { new: true },
      );

      expect(result.title).toEqual(book.title);
    });
  });

  describe('deleteBook', () => {
    it('should delete and return a book', async () => {
      jest.spyOn(bookModel, 'findByIdAndDelete').mockResolvedValue(mockBook);

      const result = await bookService.deleteBook(mockBook._id);

      expect(bookModel.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);

      expect(result).toEqual(mockBook);
    });
  });
});
