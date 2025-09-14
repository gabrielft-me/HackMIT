"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var zod_1 = require("zod");
var envSchema = zod_1.z.object({
    ANTHROPIC_API_KEY: zod_1.z.string().min(1, 'Missing ANTHROPIC_API_KEY'),
    SUPABASE_URL: zod_1.z.string().url('SUPABASE_URL must be a valid URL'),
    SUPABASE_SERVICE_KEY: zod_1.z.string().min(1, 'Missing SUPABASE_SERVICE_KEY'),
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
});
exports.env = envSchema.parse({
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    NODE_ENV: (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'development',
});
//# sourceMappingURL=env.js.map