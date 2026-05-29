import { prisma } from "../db/prisma.js";
import { BaseRepository } from "./base.repository.js";
class InquiryRepository extends BaseRepository {
    constructor() {
        super(prisma.inquiries, "INQUIRY");
    }
}
export { InquiryRepository };
//# sourceMappingURL=inquiry.repository.js.map