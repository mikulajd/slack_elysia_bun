
export async function hashPassword(password: string) {
    try {
        const hashedPassword = await Bun.password.hash(password);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}

export async function comparePassword(password: string, storedHash: string) {
    try {
        const isMatch = await Bun.password.verify(password, storedHash);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password:', error);
    }
}
export type UserData = {
    userId: number;
    email: string;
};

export class UserInfo {
    private userId: string;
    private email: string;

    constructor(user: any) {
        this.userId = user.userId;
        this.email = user.email;
    }

    getData() {
        return {
            userId: this.userId,
            email: this.email,
        };
    }
}