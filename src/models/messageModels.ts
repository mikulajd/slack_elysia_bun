import { t } from 'elysia';
export const sendMessageModel = t.Object({
    conversationId: t.Numeric(),
    parentId: t.Nullable(t.Numeric()),
    messageContent: t.String({ minLength: 1 }),
});
export const editMessageModel = t.Object({
    messageContent: t.String({ minLength: 1 }),
});
