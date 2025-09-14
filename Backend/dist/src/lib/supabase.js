"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var env_1 = require("@/env");
exports.supabaseAdmin = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
});
//# sourceMappingURL=supabase.js.map