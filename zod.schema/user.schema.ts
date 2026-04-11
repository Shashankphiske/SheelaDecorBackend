import { z } from "zod";
import { errorMessage } from "../constants/error.constants.js";

const CreateUserSchema = z.object({
    body: z.object({
        username: z.string({ error: errorMessage.INVALIDDATA.message }),
        email: z.email({ error: errorMessage.INVALIDDATA.message }),
        password: z.string({ error: errorMessage.INVALIDDATA.message }),
    })
});

export { CreateUserSchema }