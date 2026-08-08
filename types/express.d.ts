import type { Role } from "@prisma/client";
import type { Request } from "express";

declare global {
    namespace Express {
        interface User {
            id: string;
            role: Role;
            access: string[];
        }

        interface Request {
            user?: User;
        }
    }
}