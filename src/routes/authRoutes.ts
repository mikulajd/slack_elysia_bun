import { Elysia, t } from "elysia";
import AuthController from "../controllers/authController";
import { loginModel, registerModel } from "../models/authModels";
import { jwtConfig } from "../middleware/authMiddleware";
import { ElysiaCustomStatusResponse } from "elysia/error";
import { UserInfo } from "../services/authServices";


export const authRoutes = (app: Elysia) => app
    .use(jwtConfig)
    .group('/api/v1/auth', (app) => app
        .post('/register', async ({ jwt, body }) => {
            const userInfo = await AuthController.register(body);
            if (!(userInfo instanceof UserInfo)) {
                return userInfo;
            }

            const token = await jwt.sign(userInfo.getData())
            return { ...userInfo, token: token };
        },
            {
                body: registerModel
            },

        )
        .post('/login', async ({ jwt, body }) => {

            const userInfo = await AuthController.login(body);
            if (!(userInfo instanceof UserInfo)) {
                return userInfo;
            }
            const token = await jwt.sign(userInfo.getData())
            return { ...userInfo, token: token };
        },
            {
                body: loginModel
            })
        .get('/usersList', () => AuthController.getUsers(),
        )
    )