import { t } from 'elysia';

export const createConversationModel = t.Object({
    recipientId: t.Numeric(),
    conversationName: t.Optional(t.String({ minLength: 5, })),
});
export const renameConversationModel = t.Object({
    conversationName: t.String({
        minLength: 5,
    }),
});
