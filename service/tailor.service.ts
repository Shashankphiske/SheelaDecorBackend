import type { Tailor, TailorData } from "../dto/tailor.dto.js";
import type { TailorRepository } from "../repository/tailor.repository.js";
import { BaseService } from "./base.service.js";

class TailorService extends BaseService<Tailor, TailorData, any> {
    constructor(methods: TailorRepository) {
        super(methods, "TAILOR");
    }
}

export { TailorService }