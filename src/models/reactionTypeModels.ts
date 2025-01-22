import { t } from 'elysia';


export const addReactionTypeModel = t.Object({
    reactionValue: t.String({ minLength: 1 }),
});
export const editReactionTypeModel = t.Object({
    reactionValue: t.String({ minLength: 1 })
});