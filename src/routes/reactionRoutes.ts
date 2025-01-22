import { Elysia, t } from "elysia";
import ReactionController from "../controllers/reactionController";
import { authMiddleware } from "../middleware/authMiddleware";
import { addReactionModel, editReactionModel } from "../models/reactionModels";

export const reactionRoutes = (app: Elysia) => app
    .use(authMiddleware)
    .group('/reactions', (app) => app
        //Pridanie reakcie na spravu
        .post('/add', ({ user: { userId }, body }) => ReactionController.addReaction(userId, body),
            {
                body: addReactionModel
            })

        //Manipulacia s konkretnou reakciou
        .group('/:reactionId',
            {
                params: t.Object({
                    reactionId: t.Numeric()
                })
            },
            (app) => app

                //Zmazanie reakcie
                .delete('/delete', ({ user: { userId }, params }) => ReactionController.deleteReaction(userId, params),)

                //Uprava reakcie
                .put('/edit', ({ user: { userId }, params, body }) => ReactionController.editReaction(userId, { ...params, ...body }),
                    {
                        body: editReactionModel
                    })
        )



    )