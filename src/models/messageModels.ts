import { t } from 'elysia';
export const sendMessageModel = t.Object({
    conversationId: t.Numeric(),
    parentId: t.Optional(t.Numeric()),
    messageContent: t.String({ minLength: 1 }),
    attachment: t.Optional(t.File({}))
});
export const editMessageModel = t.Object({
    messageContent: t.String({ minLength: 1 }),
});
