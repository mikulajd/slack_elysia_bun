import { Prisma } from "@prisma/client";
import { error as elysiaError } from 'elysia';
export function handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientRustPanicError ||
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientValidationError
    ) {
        return elysiaError(500, { message: "Database error occurred" })
    } else {
        return elysiaError(500, { message: "Unexpected error occurred" });
    }
}
