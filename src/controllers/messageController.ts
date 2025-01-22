import db from '../db/prismaClient';
import { error as elysiaError } from 'elysia'
import { handlePrismaError } from '../services/prismaErrorHandler';
import { deleteFileIfExists, saveFileAndGetPath } from '../services/storageService';

abstract class MessageController {
    static readonly FILE_STORAGE_PATH = "storage/";

    static async sendMessage(userId: number, options: { conversationId: number, parentId?: number, messageContent: string, attachment?: File }) {
        try {
            const { conversationId, messageContent, parentId, attachment } = options;
            const conversation = await db.conversation.findFirst({
                where:
                {
                    AND: [{ conversationId: conversationId },
                    {
                        OR: [
                            { initiatorId: userId },
                            { recipientId: userId }]
                    }]
                }
            },)
            if (!conversation) {
                return elysiaError(404, { message: `Conversation with id ${conversationId} not found` })
            }

            const path = await saveFileAndGetPath(attachment);
            return await db.message.create({
                data: {
                    userId: userId,
                    conversationId: conversationId,
                    messageContent: messageContent,
                    parentId: parentId,
                    filePath: path
                }
            })
        } catch (error) {
            return handlePrismaError(error);
        }
    }



    static async editMessage(userId: number, options: { messageId: number, messageContent: string }) {
        try {
            const { messageId, messageContent } = options;
            const message = await getMessageById(messageId);
            if (!message) {
                return elysiaError(404, { message: `Message with id ${messageId} not found` })
            }
            if (message.userId != userId) {
                return elysiaError(401, { message: 'You dont have permission to edit this message' })
            }
            return await db.message.update({
                where: {
                    messageId: messageId,
                },
                data: {
                    messageContent: messageContent
                }
            });
        } catch (error) {
            return handlePrismaError(error);
        }
    }



    static async deleteMessage(userId: number, options: { messageId: number, }) {
        try {
            const { messageId } = options;
            const message = await getMessageById(messageId);
            if (!message) {
                return elysiaError(404, { message: `Message with id ${messageId} not found` })
            }
            if (message.userId != userId) {
                return elysiaError(401, { message: 'You dont have permission to delete this message' })
            }
            await deleteFileIfExists(message.filePath);
            return await db.message.delete({
                where: {
                    messageId: messageId,
                },

            });
        } catch (error) {
            return handlePrismaError(error);
        }
    }



    static async getReplies(userId: number, options: { messageId: number }) {
        try {
            const { messageId } = options;
            const message = await getMessageById(messageId, { includeReplies: true, includeConversation: true });
            if (!message || (message.conversation.initiatorId != userId && message.conversation.recipientId != userId)) {
                return elysiaError(404, { message: `Message with id ${messageId} not found` })
            }
            return message.replies;
        } catch (error) {
            return handlePrismaError(error);
        }
    }



    static async getReactions(userId: number, options: { messageId: number }) {
        try {
            const { messageId } = options;
            const message = await getMessageById(messageId, { includeReactions: true, includeConversation: true });
            if (!message || (message.conversation.initiatorId != userId && message.conversation.recipientId != userId)) {
                return elysiaError(401, { message: 'You dont have access to this message' })
            }
            return message.reactions;
        } catch (error) {
            return handlePrismaError(error);
        }
    }



    static async getParent(userId: number, options: { messageId: number }) {
        try {
            const { messageId } = options;
            const message = await getMessageById(messageId, { includeParent: true, includeConversation: true });
            if (!message || (message.conversation.initiatorId != userId && message.conversation.recipientId != userId)) {
                return elysiaError(401, { message: 'You dont have access to this message' })
            }
            return message.parent;
        } catch (error) {
            return handlePrismaError(error);
        }
    }
};

async function getMessageById(
    messageId: number,
    options?: {
        includeReactions?: boolean,
        includeReplies?: boolean,
        includeParent?: boolean,
        includeConversation?: boolean
    }) {
    const message = await db.message.findFirst({
        where:
        {
            messageId: messageId,
        },
        include: {
            reactions: options?.includeReactions ?? false,
            replies: options?.includeReplies ?? false,
            parent: options?.includeParent ?? false,
            conversation: options?.includeConversation ?? false
        }
    });
    return message;

}
export default MessageController;
