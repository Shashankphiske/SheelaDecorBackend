type Role = "USER" | "ADMIN" | "INTERIOR" | "SALES_ASSOCIATE";
interface Token {
    id: string;
    familyId: string;
    userId: string;
    role: Role;
    isUsed: boolean;
}
interface TokenData {
    familyId: string;
    userId: string;
    role: Role;
}
declare const CookieOptions: {
    sameSite: "none";
    secure: boolean;
    partitioned: boolean;
    httpOnly: boolean;
};
export type { TokenData, Token, Role };
export { CookieOptions };
//# sourceMappingURL=token.dto.d.ts.map