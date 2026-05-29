class ApiResponse {
    success;
    message;
    data;
    constructor(success, message, data = null) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    static success(res, message, data = null, status = 200) {
        return res.status(status).json(new ApiResponse(true, message, data));
    }
    static error(res, message, status = 400) {
        return res.status(status).json(new ApiResponse(false, message));
    }
}
export { ApiResponse };
//# sourceMappingURL=api.utils.js.map