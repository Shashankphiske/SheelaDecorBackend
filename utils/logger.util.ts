// Plain console logger — works in both Node.js and Cloudflare Workers.
// Winston's format.colorize() crashes in workerd (chalk checks process.stdout.isTTY
// which is undefined in the Workers runtime, causing the global error handler to throw
// and return a raw HTML 500 instead of our JSON error response).

const logger = {
    error: (message: unknown, meta?: Record<string, unknown>) => {
        console.error("[ERROR]", message, meta ? JSON.stringify(meta) : "");
    },
    warn: (message: unknown, meta?: Record<string, unknown>) => {
        console.warn("[WARN]", message, meta ? JSON.stringify(meta) : "");
    },
    info: (message: unknown, meta?: Record<string, unknown>) => {
        console.log("[INFO]", message, meta ? JSON.stringify(meta) : "");
    },
    http: (message: unknown, meta?: Record<string, unknown>) => {
        console.log("[HTTP]", message, meta ? JSON.stringify(meta) : "");
    },
    debug: (message: unknown, meta?: Record<string, unknown>) => {
        console.debug("[DEBUG]", message, meta ? JSON.stringify(meta) : "");
    },
};

export { logger };