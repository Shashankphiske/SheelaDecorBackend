import type { Machine, MachineData } from "../dto/machine.dto.js";
import type { MachineRepository } from "../repository/machine.repository.js";
import { BaseService } from "./base.service.js";

class MachineService extends BaseService<Machine, MachineData, any> {
    constructor(methods: MachineRepository) {
        super(methods, "MACHINE");
    }
}

export { MachineService };
