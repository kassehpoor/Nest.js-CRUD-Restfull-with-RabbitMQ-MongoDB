// user.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  userId: string;
  
  avatarUrl?: string;
}

export const UserModel = SchemaFactory.createForClass(User);
