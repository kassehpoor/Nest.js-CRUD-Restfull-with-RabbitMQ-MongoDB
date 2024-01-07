import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(userData: any): Promise<{
        message: string;
        user: import("./user.model").User;
    }>;
    getUser(userId: string): Promise<any>;
    getUserAvatar(userId: string): Promise<{
        avatar: string;
    }>;
    deleteUserAvatar(userId: string): Promise<{
        message: string;
    }>;
}
