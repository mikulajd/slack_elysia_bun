import db from '../db/prismaClient';
import { error as elysiaError } from 'elysia'
import { handlePrismaError } from '../services/prismaErrorHandler';

abstract class ReactionTypeController {
    static async getAllReactionTypes() {
        try {

            return await db.reactionType.findMany()
        } catch (error) {
            return handlePrismaError(error);

        }
    }


    static async addReactionType(reactionValue: string) {
        try {

            return await db.reactionType.create({
                data: {
                    reactionValue: reactionValue
                }
            })
        } catch (error) {
            return handlePrismaError(error);

        }
    }
    static async editReactionType(options: { reactionTypeId: number, reactionValue: string, }) {
        try {
            const { reactionTypeId, reactionValue } = options;
            return await db.reactionType.update(
                {
                    where: {
                        reactionTypeId: reactionTypeId,
                    },
                    data: {
                        reactionValue: reactionValue,
                    }
                })
        } catch (error) {
            return handlePrismaError(error);
        }
    }
    static async deleteReactionType(reactionTypeId: number) {
        try {

            return await db.reactionType.delete(
                {
                    where: {
                        reactionTypeId: reactionTypeId,
                    },
                });
        } catch (error) {
            return handlePrismaError(error);
        }
    }




}

export default ReactionTypeController;
