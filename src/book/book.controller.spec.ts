import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Category } from './schemas/book.schema';
import { PassportModule } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import { CreateBookDto } from './dto/create-book-dto';
import { UpdateBookDto } from './dto/update-book-dto';

describe('BookController', () => {
  let bookController: BookController;
  let bookService: BookService;

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
    createBook: jest.fn(),
    getAllBooks: jest.fn().mockReturnValue([mockBook]),
    getBookById: jest.fn().mockReturnValue(mockBook),
    updateBook: jest.fn(),
    deleteBook: jest.fn().mockReturnValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [BookController],
      providers: [{ provide: BookService, useValue: mockBookService }],
    }).compile();

    bookController = module.get<BookController>(BookController);
    bookService = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(bookController).toBeDefined();
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const newBook = {
        title: 'Book 1',
        description: 'Book 1 Description',
        author: 'Author 1',
        price: 100,
        category: Category.ADVENTURE,
      };

      mockBookService.createBook = jest.fn().mockReturnValue(mockBook);

      const result = await bookController.createBook(
        newBook as CreateBookDto,
        mockUser as User,
      );

      expect(bookService.createBook).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('getAllBooks', () => {
    it('should get all books', async () => {
      const req = { user: { ...mockUser } };
      const query = {
        keyword: 'test',
        page: '1',
      };

      const result = await bookController.getAllBooks(req, query);

      expect(bookService.getAllBooks).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('getBookById', () => {
    it('should get one book', async () => {
      const result = await bookController.getBookById(mockBook._id);

      expect(bookService.getBookById).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('updateBook', () => {
    it('should update a book', async () => {
      const updatedBook = { ...mockBook, title: 'Updated title' };
      const book = { title: 'Updated title' };

      mockBookService.updateBook = jest.fn().mockReturnValue(updatedBook);

      const result = await bookController.updateBook(
        mockBook._id,
        book as UpdateBookDto,
      );

      expect(bookService.updateBook).toHaveBeenCalled();
      expect(result).toEqual(updatedBook);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const result = await bookController.deleteBook(mockBook._id);

      expect(bookService.deleteBook).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });
  });
});
