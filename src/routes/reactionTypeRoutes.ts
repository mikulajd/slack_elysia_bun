import { Elysia, t } from "elysia";
import ReactionTypeController from "../controllers/reactionTypeController";
import { addReactionTypeModel, editReactionTypeModel } from "../models/reactionTypeModels";

export const reactionTypeRoutes = (app: Elysia) => app
    .group('/reactionTypes', (app) => app
        .get('', () => ReactionTypeController.getAllReactionTypes())
        .post('/add', ({ body }) => ReactionTypeController.addReactionType(body.reactionValue),
            {
                body: addReactionTypeModel
            })
        .group('/:reactionTypeId', {
            params: t.Object({
                reactionTypeId: t.Numeric()
            })
        }, (app) => app
            .delete('/delete', ({ params }) => ReactionTypeController.deleteReactionType(params.reactionTypeId),)

            .put('/edit', ({ params, body }) => ReactionTypeController.editReactionType({ ...params, ...body }),
                {
                    body: editReactionTypeModel
                })
        )

    )