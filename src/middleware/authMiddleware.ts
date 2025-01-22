import bearer from "@elysiajs/bearer";
import db from '../db/prismaClient';
import jwt from "@elysiajs/jwt";
import Elysia, { error } from "elysia";
import { UserInfo, type UserData } from "../services/authServices";

export const jwtConfig = jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET!,
    exp: "1d"
})

export const authMiddleware = (app: Elysia) => app
    .use(bearer())
    .use(jwtConfig)
    .derive(async ({ jwt, bearer }) => {

        const userData = await jwt.verify(bearer) as UserData;
        if (!userData) {
            return error(401, { message: 'Unauthorzied' })
        }
        const user = await db.user.findFirst({ where: { userId: userData.userId } })
        if (!user) {
            return error(401, { message: 'Unauthorzied' })
        }
        return { user: user };
    })

export async function signJWT(response: any, jwt: any) {
    if (!(response instanceof UserInfo)) {
        return response;
        ;
    }
    const token = await jwt.sign(response.getData())
    return { status: 'success', token: token };

}