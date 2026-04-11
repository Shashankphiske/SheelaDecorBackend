import { AuthUtilsClass } from "../utils/auth.utils.js";
import { RedisUtils } from "../utils/redis.utils.js";

const redisUtils = new RedisUtils();
const authUtils = new AuthUtilsClass();

export { redisUtils, authUtils }