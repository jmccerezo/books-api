import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book-dto';
import { UpdateBookDto } from './dto/update-book-dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist';

@ApiBearerAuth()
@ApiTags('books')
@Controller('books')
@UseGuards(AuthGuard('jwt'))
export class BookController {
  constructor(private bookService: BookService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: Book })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async createBook(
    @Body() book: CreateBookDto,
    @Req() req: any,
  ): Promise<Book> {
    return await this.bookService.createBook(book, req.user);
  }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: Book })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiQuery({ name: 'keyword', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  async getAllBooks(@Req() req: any, @Query() query: any): Promise<Book[]> {
    return await this.bookService.getAllBooks(req.user._id, query);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: Book })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async getBookById(@Param('id') id: string): Promise<Book> {
    return await this.bookService.getBookById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: Book })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async updateBook(
    @Param('id') id: string,
    @Body() book: UpdateBookDto,
  ): Promise<Book> {
    return await this.bookService.updateBook(id, book);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: Book })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async deleteBook(@Param('id') id: string): Promise<Book> {
    return await this.bookService.deleteBook(id);
  }
}
