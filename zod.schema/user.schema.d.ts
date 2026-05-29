import { z } from "zod";
declare const CreateUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export { CreateUserSchema };
//# sourceMappingURL=user.schema.d.ts.map