import type { Role } from "../generated/prisma/enums.ts";
import type { Request } from "express";

declare global {
    namespace Express {
        interface User {
            id: string;
            role: Role;
        }

        interface Request {
            user?: User;
        }
    }
}