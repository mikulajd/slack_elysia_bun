import { error as elysiaError } from 'elysia';
import db from '../db/prismaClient';
import { hashPassword, comparePassword, UserInfo } from '../services/authServices'
import { handlePrismaError } from '../services/prismaErrorHandler';
abstract class AuthController {

    static async register(
        options: {
            firstName: string,
            lastName: string,
            email: string,
            password: string,

        }) {
        try {
            const { firstName, lastName, email, password } = options;
            const hashedPassword = await hashPassword(password);
            const userExists = await db.user.findFirst({
                where: {
                    email: email,
                }
            });
            if (userExists) {
                return elysiaError(400, { message: 'User with this email already exists' });

            } const user = await db.user.create({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashedPassword!
                }
            })
            return new UserInfo(user);
        } catch (error) {
            return handlePrismaError(error)
        }

    }


    static async login(
        options: {
            email: string,
            password: string,

        }) {
        try {
            const { email, password } = options;
            const user = await db.user.findFirst({
                where: {
                    email: email,
                }
            });
            if (!user) {
                return elysiaError(400, { message: 'User with this email does not exist' });

            }
            const isMatch = await comparePassword(password, user?.password)
            if (!isMatch) {
                return elysiaError(400, { message: 'Incorrect password' });
            }
            return new UserInfo(user);
        } catch (error) {
            return handlePrismaError(error);
        }
    }


    static async getUsers() {
        try {
            const users = await db.user.findMany();
            const retval = users.map((user) => new UserInfo(user));
            return retval;
        } catch (error) {
            return handlePrismaError(error);
        }
    }
}
export default AuthController