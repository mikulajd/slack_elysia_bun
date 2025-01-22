import { Elysia, t } from "elysia";
import MessageController from "../controllers/messageController";
import { authMiddleware } from "../middleware/authMiddleware";
import { editMessageModel, sendMessageModel } from "../models/messageModels";

export const messageRoutes = (app: Elysia) => app
    .use(authMiddleware)
    .group('/messages', (app) => app
        //Poslanie spravy do konverzacie
        .post('/send', ({ user: { userId }, body }) => MessageController.sendMessage(userId, body),
            {
                body: sendMessageModel
            })

        //Manipulacia konkretnej spravy
        .group('/:messageId',
            {
                params: t.Object({
                    messageId: t.Numeric()
                })
            },
            (app) => app

                //Ziskanie odpovedi na spravu
                .get('/replies', ({ user: { userId }, params }) => MessageController.getReplies(userId, params),)

                //Reakcie na spravu. Neviem ci by to bolo lepsie tu alebo v reactionRoutes.ts. 
                //Kazdopadne reakcie su returnovane spolu so spravou cize teoreticky je to nepotrebne 
                .get('/reactions', ({ user: { userId }, params }) => MessageController.getReactions(userId, params),)

                //Ziskanie spravy na ktoru bolo odpovedane
                .get('/parent', ({ user: { userId }, params }) => MessageController.getParent(userId, params),)

                //Zmazanie spravy
                .delete('/delete', ({ user: { userId }, params }) => MessageController.deleteMessage(userId, params),)

                //Uprava spravy
                .put('/edit', ({ user: { userId }, params, body }) => MessageController.editMessage(userId, { ...params, ...body }),

                    {
                        body: editMessageModel
                    })

        )
    )