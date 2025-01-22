import { Elysia, t } from "elysia";
import AuthController from "../controllers/authController";
import { loginModel, registerModel } from "../models/authModels";
import { jwtConfig, signJWT } from "../middleware/authMiddleware";


export const authRoutes = (app: Elysia) => app
    .use(jwtConfig)
    .group('/api/v1/auth', (app) => app
        .post('/register', ({ body }) => AuthController.register(body),
            {
                afterHandle: async ({ jwt, response }) => signJWT(response, jwt),
                body: registerModel
            },)
        .post('/login', ({ body }) => AuthController.login(body),
            {
                afterHandle: async ({ jwt, response }) => signJWT(response, jwt),
                body: loginModel
            })
        .get('/usersList', () => AuthController.getUsers(),
        )
    )