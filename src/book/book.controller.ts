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
import { BookEntity } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist';

@Controller('books')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: BookEntity })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async createBook(
    @Body() book: CreateBookDto,
    @Req() req: any,
  ): Promise<Book> {
    return await this.bookService.createBook(book, req.user);
  }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: BookEntity, isArray: true })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  @ApiQuery({ name: 'keyword', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  async getAllBooks(@Req() req: any, @Query() query: any): Promise<Book[]> {
    return await this.bookService.getAllBooks(req.user._id, query);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: BookEntity })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async getBookById(@Param('id') id: string): Promise<Book> {
    return await this.bookService.getBookById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: BookEntity })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async updateBook(
    @Param('id') id: string,
    @Body() book: UpdateBookDto,
  ): Promise<Book> {
    return await this.bookService.updateBook(id, book);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: BookEntity })
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Error: Unauthorized' })
  async deleteBook(@Param('id') id: string): Promise<Book> {
    return await this.bookService.deleteBook(id);
  }
}
