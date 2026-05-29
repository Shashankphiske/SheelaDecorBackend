class ControllerMessages {
    name;
    CREATE;
    FETCH;
    FETCHALL;
    UPDATE;
    DELETE;
    constructor(name) {
        this.name = name;
        this.CREATE = {
            req: `${this.name} create request received`,
            res: `${this.name} created successfully`
        };
        this.FETCH = {
            req: `${this.name} fetch request received`,
            res: `${this.name} fetched successfully`
        };
        this.FETCHALL = {
            req: `${this.name} fetch all request received`,
            res: `${this.name}s fetched successfully`
        };
        this.UPDATE = {
            req: `${this.name} update request received`,
            res: `${this.name} updated successfully`
        };
        this.DELETE = {
            req: `${this.name} delete request received`,
            res: `${this.name} deleted successfully`
        };
    }
}
export { ControllerMessages };
//# sourceMappingURL=controller.messages.js.map