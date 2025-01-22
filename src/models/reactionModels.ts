import { t } from 'elysia';


export const addReactionModel = t.Object({
    messageId: t.Numeric(),
    reactionTypeId: t.Numeric(),
});
export const editReactionModel = t.Object({
    reactionTypeId: t.Numeric(),
});