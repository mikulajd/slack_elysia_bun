import { error as elysiaError } from 'elysia';
import db from '../db/prismaClient';
import { handlePrismaError } from '../services/prismaErrorHandler';



abstract class ConversationController {

    static readonly MESSAGES_PAGE_LENGTH = 2;
    static readonly CONVERSATIONS_PAGE_LENGTH = 3;
    static async getUserConversations(userId: number, pageNum: number = 1) {
        try {
            return await db.conversation.findMany({
                where: {
                    OR: [
                        { initiatorId: userId },
                        { recipientId: userId }]
                },
                skip: (pageNum - 1) * this.CONVERSATIONS_PAGE_LENGTH,
                take: this.CONVERSATIONS_PAGE_LENGTH,
            })
        } catch (error) {
            console.log(error);
            return handlePrismaError(error);
        }
    }



    static async getConversation(userId: number, options: { conversationId: number }) {
        try {
            const { conversationId } = options;
            const conversation = await getConversationById(userId, conversationId);
            if (!conversation) {
                return elysiaError(404, { message: `Conversation with id ${conversationId} not found` })
            }
            return conversation;
        } catch (error) {
            return handlePrismaError(error);
        }
    }



    static async createConversation(userId: number, options: { recipientId: number, conversationName?: string }) {
        try {
            const { recipientId, conversationName } = options;
            if (recipientId == userId) {
                return elysiaError(400, { message: 'You cannot create a conversation with yourself' })
            }

            return await db.conversation.create({
                data: {
                    initiatorId: userId,
                    recipientId: recipientId,
                    conversationName: conversationName,
                }
            })
        } catch (error) {
            return handlePrismaError(error);
        }

    }



    static async renameConversation(userId: number, options: { conversationId: number, conversationName: string }) {
        try {
            const { conversationId, conversationName } = options;
            const conversation = await getConversationById(userId, conversationId);
            if (!conversation) {
                return elysiaError(404, { message: `Conversation with id ${conversationId} not found` })
            }
            return await db.conversation.update({
                where: {
                    conversationId: conversationId
                },
                data: {
                    conversationName: conversationName
                }
            });
        } catch (error) {
            return handlePrismaError(error);
        }
    }



    static async deleteConversation(userId: number, options: { conversationId: number }) {
        try {
            const { conversationId } = options;
            const conversation = await getConversationById(userId, conversationId);
            if (!conversation) {
                return elysiaError(404, { message: `Conversation with id ${conversationId} not found` })
            }
            return db.conversation.delete({ where: { conversationId: conversationId } });
        } catch (error) {
            return handlePrismaError(error);
        }
    }



    static async getMessages(userId: number, options: { conversationId: number, pageNum?: number }) {
        try {
            const { conversationId, pageNum = 1, } = options;
            const conversation = await getConversationById(userId, conversationId);
            if (!conversation) {
                return elysiaError(404, { message: `Conversation with id ${conversationId} not found` })
            }
            const messages = await db.message.findMany({
                where:
                {
                    conversationId: conversationId
                },
                skip: (pageNum - 1) * this.MESSAGES_PAGE_LENGTH,
                take: this.MESSAGES_PAGE_LENGTH,
                include: {
                    reactions: true
                }
            })
            return messages;


        } catch (error) {
            return handlePrismaError(error);
        }
    }
};

async function getConversationById(userId: number, conversationId: number,) {

    const conversation = await db.conversation.findFirst({
        where:
        {
            AND: [
                { conversationId: conversationId },
                {
                    OR: [
                        { initiatorId: userId },
                        { recipientId: userId }]
                }]
        },

    });
    return conversation;


}
export default ConversationController;
