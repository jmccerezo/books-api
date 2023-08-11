import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ unique: [true, 'This email is already used.'] })
  email: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop({ default: null })
  resetPasswordOtp: number;

  @ApiProperty()
  @Prop({ default: null })
  resetOtpExpiry: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
