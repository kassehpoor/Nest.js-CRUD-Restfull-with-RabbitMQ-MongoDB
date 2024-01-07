import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { User } from './user.model';
import axios from 'axios';
import * as fs from 'fs';
import * as util from 'util';

@Injectable()
export class UserService {
  private readonly rabbitMQClient: ClientProxy;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {
    this.rabbitMQClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'user_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async createUser(userData: any): Promise<User> {
    try {
      const newUser = new this.userModel(userData);
      return await newUser.save();
    } catch (error) {
      throw new Error('Failed to create user.');
    }
  }

  async sendEmail(user: User): Promise<void> {
    console.log(`Sending email to ${user.email}`);
    // Implement logic to send a real email using a mail service (e.g., Nodemailer)
  }

  async emitRabbitEvent(user: User): Promise<void> {
    try {
      const pattern = { cmd: 'user_created' };
      await this.rabbitMQClient.emit(pattern, { userId: user._id });
    } catch (error) {
      console.error('Failed to emit RabbitMQ event:', error.message);
    }
  }

  async getUserFromExternalApi(userId: string): Promise<any> {
    try {
      const response = await axios.get(`https://reqres.in/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to retrieve data from external API:', error.message);
      throw new Error('Failed to retrieve user data from external API.');
    }
  }

  async getUserAvatar(userId: string): Promise<string> {
    const user = await this.userModel.findOne({ userId });

    if (user && user.avatarUrl) {
      return user.avatarUrl;
    } else {
      const avatarUrl = `https://reqres.in/api/users/${userId}/avatar`;
      const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
      const base64 = Buffer.from(response.data, 'binary').toString('base64');

      await this.userModel.updateOne({ userId }, { $set: { avatarUrl } });

      return base64;
    }
  }

  async deleteUserAvatar(userId: string): Promise<void> {
    try {
      const user = await this.userModel.findOne({ userId });

      if (user && user.avatarUrl) {
        const deleteFile = util.promisify(fs.unlink);
        await deleteFile(user.avatarUrl);

        await this.userModel.updateOne({ userId }, { $unset: { avatarUrl: 1 } });
      }
    } catch (error) {
      console.error('Failed to delete user avatar:', error.message);
      throw new NotFoundException('User avatar not found.');
    }
  }
}
