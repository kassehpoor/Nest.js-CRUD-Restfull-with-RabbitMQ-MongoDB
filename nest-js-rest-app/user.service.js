"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const microservices_1 = require("@nestjs/microservices");
const axios_1 = require("axios");
const fs = require("fs");
const util = require("util");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
        this.rabbitMQClient = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: ['amqp://localhost:5672'],
                queue: 'user_queue',
                queueOptions: {
                    durable: false,
                },
            },
        });
    }
    async createUser(userData) {
        try {
            const newUser = new this.userModel(userData);
            return await newUser.save();
        }
        catch (error) {
            throw new Error('Failed to create user.');
        }
    }
    async sendEmail(user) {
        console.log(`Sending email to ${user.email}`);
    }
    async emitRabbitEvent(user) {
        try {
            const pattern = { cmd: 'user_created' };
            await this.rabbitMQClient.emit(pattern, { userId: user._id });
        }
        catch (error) {
            console.error('Failed to emit RabbitMQ event:', error.message);
        }
    }
    async getUserFromExternalApi(userId) {
        try {
            const response = await axios_1.default.get(`https://reqres.in/api/users/${userId}`);
            return response.data;
        }
        catch (error) {
            console.error('Failed to retrieve data from external API:', error.message);
            throw new Error('Failed to retrieve user data from external API.');
        }
    }
    async getUserAvatar(userId) {
        const user = await this.userModel.findOne({ userId });
        if (user && user.avatarUrl) {
            return user.avatarUrl;
        }
        else {
            const avatarUrl = `https://reqres.in/api/users/${userId}/avatar`;
            const response = await axios_1.default.get(avatarUrl, { responseType: 'arraybuffer' });
            const base64 = Buffer.from(response.data, 'binary').toString('base64');
            await this.userModel.updateOne({ userId }, { $set: { avatarUrl } });
            return base64;
        }
    }
    async deleteUserAvatar(userId) {
        try {
            const user = await this.userModel.findOne({ userId });
            if (user && user.avatarUrl) {
                const deleteFile = util.promisify(fs.unlink);
                await deleteFile(user.avatarUrl);
                await this.userModel.updateOne({ userId }, { $unset: { avatarUrl: 1 } });
            }
        }
        catch (error) {
            console.error('Failed to delete user avatar:', error.message);
            throw new common_1.NotFoundException('User avatar not found.');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map