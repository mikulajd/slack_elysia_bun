import { t } from "elysia";


export const registerModel = t.Object({
    firstName: t.String({ minLength: 2, }),
    lastName: t.String({ minLength: 2, }),
    email: t.String({ format: "email", }),
    password: t.String({ minLength: 8, }),

});
export const loginModel = t.Object({
    email: t.String({ format: "email", }),
    password: t.String({ minLength: 8, })
});
export const changePasswordModel = t.Object({
    email: t.String({ format: "email", }),
    oldPassword: t.String(),
    newPassword: t.String({ minLength: 8 }),
});