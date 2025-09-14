"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
var sdk_1 = require("@anthropic-ai/sdk");
var server_1 = require("next/server");
var zod_1 = require("zod");
var env_1 = require("@/env");
var inputSchema = zod_1.z.object({
    size_of_company: zod_1.z.string().min(1),
    ai_service_in_usage: zod_1.z.string().min(1),
    business_model: zod_1.z.string().min(1),
    type_of_data_processed: zod_1.z.string().min(1),
    amount_of_latency: zod_1.z.string().min(1),
    data_sensitivity: zod_1.z.string().min(1),
    savings: zod_1.z.string().min(1),
});
var normalizedSchema = zod_1.z.object({
    company_size: zod_1.z.enum(['solo', 'startup', 'smb', 'midmarket', 'enterprise']),
    current_ai_provider: zod_1.z.enum(['openai', 'anthropic', 'google', 'other']).nullable(),
    business_model: zod_1.z.enum(['saas', 'marketplace', 'agency', 'consulting', 'consumer_app', 'other']),
    data_types: zod_1.z.array(zod_1.z.enum(['pii', 'phi', 'code', 'documents', 'multimedia', 'other'])),
    latency_requirement_ms: zod_1.z.number().int().nonnegative(),
    data_sensitivity: zod_1.z.enum(['low', 'medium', 'high', 'regulated']),
    savings_goal_usd_per_month: zod_1.z.number().nonnegative(),
});
var anthropic = new sdk_1.default({ apiKey: env_1.env.ANTHROPIC_API_KEY });
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var json, parsed, system, userPrompt, completion, content, normalized, validated, err_1, message;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, req.json()];
                case 1:
                    json = _b.sent();
                    parsed = inputSchema.parse(json);
                    system = "You transform free-form company info into a normalized JSON used to compare against model options for cost optimization.";
                    userPrompt = "Given the following company info, map it to the normalized JSON schema.\n\nCompany info (keys are in Portuguese-like English):\n- size_of_company: ".concat(parsed.size_of_company, "\n- ai_service_in_usage: ").concat(parsed.ai_service_in_usage, "\n- business_model: ").concat(parsed.business_model, "\n- type_of_data_processed: ").concat(parsed.type_of_data_processed, "\n- amount_of_latency: ").concat(parsed.amount_of_latency, "\n- data_sensitivity: ").concat(parsed.data_sensitivity, "\n- savings: ").concat(parsed.savings, "\n\nNormalized JSON schema (respond with ONLY minified JSON that conforms):\n").concat(normalizedSchema.toString());
                    return [4 /*yield*/, anthropic.messages.create({
                            model: 'claude-3-5-sonnet-latest',
                            max_tokens: 600,
                            temperature: 0,
                            system: system,
                            messages: [
                                { role: 'user', content: userPrompt },
                            ],
                        })];
                case 2:
                    completion = _b.sent();
                    content = (_a = completion.content) === null || _a === void 0 ? void 0 : _a[0];
                    if (!content || content.type !== 'text') {
                        return [2 /*return*/, server_1.NextResponse.json({ error: 'Invalid response from Claude' }, { status: 502 })];
                    }
                    normalized = void 0;
                    try {
                        normalized = JSON.parse(content.text);
                    }
                    catch (_c) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: 'Claude did not return valid JSON' }, { status: 502 })];
                    }
                    validated = normalizedSchema.parse(normalized);
                    return [2 /*return*/, server_1.NextResponse.json({ normalized: validated })];
                case 3:
                    err_1 = _b.sent();
                    if (err_1 instanceof zod_1.z.ZodError) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: err_1.issues }, { status: 400 })];
                    }
                    message = err_1 instanceof Error ? err_1.message : 'Unknown error';
                    return [2 /*return*/, server_1.NextResponse.json({ error: message }, { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=route.js.map