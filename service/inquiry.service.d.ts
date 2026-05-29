import type { Inquiry, InquiryData } from "../dto/inquiry.dto.js";
import type { InquiryRepository } from "../repository/inquiry.repository.js";
import { BaseService } from "./base.service.js";
declare class InquiryService extends BaseService<Inquiry, InquiryData, any> {
    constructor(methods: InquiryRepository);
}
export { InquiryService };
//# sourceMappingURL=inquiry.service.d.ts.map