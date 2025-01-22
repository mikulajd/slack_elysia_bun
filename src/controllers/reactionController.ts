import db from '../db/prismaClient';
import { error as elysiaError } from 'elysia'
import { handlePrismaError } from '../services/prismaErrorHandler';

abstract class ReactionController {


    static async addReaction(userId: number, options: { reactionTypeId: number, messageId: number, }) {
        try {
            const { messageId, reactionTypeId } = options;
            const message = await db.message.findFirst({
                where: { messageId: messageId }, include: {
                    conversation: true
                }
            })
            if (message?.conversation.recipientId != userId && message?.conversation.initiatorId != userId) {
                return elysiaError(404, { message: `Message with id ${messageId} not found` });

            }
            const reaction = await db.reaction.findFirst({
                where: {
                    userId: userId,
                    messageId: messageId
                }
            })
            if (reaction) {
                return elysiaError(400, { message: `You have already added reaction to message with id ${messageId}` })
            }
            return await db.reaction.create({
                data: {
                    userId: userId,
                    reactionTypeId: reactionTypeId,
                    messageId: messageId,
                }
            })
        } catch (error) {
            return handlePrismaError(error);

        }
    }
    static async editReaction(userId: number, options: { reactionId: number, reactionTypeId: number }) {
        try {
            const { reactionId, reactionTypeId } = options;
            const reaction = await getReactionById(userId, reactionId)
            if (!reaction) {
                return elysiaError(404, { message: `Reaction with id ${reactionId} not found` });
            }
            return await db.reaction.update(
                {
                    where: {
                        reactionId: reactionId,
                    },
                    data: {
                        reactionTypeId: reactionTypeId,
                    }
                })
        } catch (error) {
            return handlePrismaError(error);
        }
    }
    static async deleteReaction(userId: number, options: { reactionId: number, }) {
        try {
            const { reactionId } = options;
            const reaction = await getReactionById(userId, reactionId)
            if (!reaction) {
                return elysiaError(404, { message: `Reaction with id ${reactionId} not found` });
            }
            return await db.reaction.delete(
                {
                    where: {
                        reactionId: reactionId,
                        userId: userId
                    },
                });
        } catch (error) {
            return handlePrismaError(error);
        }
    }




}

async function getReactionById(userId: number, reactionId: number) {
    return await db.reaction.findFirst(
        {
            where: {
                reactionId: reactionId,
                userId: userId
            },

        })
}

export default ReactionController;
