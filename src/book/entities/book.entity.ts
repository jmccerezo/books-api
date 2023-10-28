import { ApiProperty } from '@nestjs/swagger';

export class BookEntity {
  @ApiProperty({ example: '653a07be4c6972dfec6a9c18' })
  readonly _id: string;

  @ApiProperty({ example: 'Book Title' })
  readonly title: string;

  @ApiProperty({ example: 'Book Description' })
  readonly description: string;

  @ApiProperty({ example: 'Book Author' })
  readonly author: string;

  @ApiProperty({ example: 100 })
  readonly price: number;

  @ApiProperty({ example: 'Adventure' })
  readonly category: string;

  @ApiProperty({ example: '653104532155727dc31faeac' })
  readonly user_id: string;

  @ApiProperty({ example: '2023-10-26T06:31:26.979Z' })
  readonly createdAt: Date;

  @ApiProperty({ example: '2023-10-26T06:31:26.979Z' })
  readonly updatedAt: Date;

  @ApiProperty({ example: 0 })
  readonly __v: number;
}
