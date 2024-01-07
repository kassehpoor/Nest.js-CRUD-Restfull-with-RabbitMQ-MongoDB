// user.controller.ts

import { Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Body } from '@nestjs/common';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: any) {
 
    // Implement logic to store user entry in db
  const user = await this.userService.createUser(userData);
    // Dummy logic to send an email
    this.userService.sendEmail(user);
    // Dummy logic to emit a RabbitMQ event
    this.userService.emitRabbitEvent(user);

    return { message: 'User created successfully', user };
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    // Implement logic to retrieve data from reqres.in
    return this.userService.getUserFromExternalApi(userId);
  }

  @Get(':userId/avatar')
  async getUserAvatar(@Param('userId') userId: string) {
    // Implement logic to retrieve and handle user avatar
    const avatarBase64 = await this.userService.getUserAvatar(userId);
    return { avatar: avatarBase64 };
  }

  @Delete(':userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string) {
    // Implement logic to remove user avatar
    await this.userService.deleteUserAvatar(userId);
    return { message: 'User avatar deleted successfully' };
  }
}
