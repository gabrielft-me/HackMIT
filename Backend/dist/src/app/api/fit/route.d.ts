import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
declare const normalizedSchema: z.ZodObject<{
    company_size: z.ZodEnum<{
        solo: "solo";
        startup: "startup";
        smb: "smb";
        midmarket: "midmarket";
        enterprise: "enterprise";
    }>;
    current_ai_provider: z.ZodNullable<z.ZodEnum<{
        openai: "openai";
        anthropic: "anthropic";
        google: "google";
        other: "other";
    }>>;
    business_model: z.ZodEnum<{
        other: "other";
        saas: "saas";
        marketplace: "marketplace";
        agency: "agency";
        consulting: "consulting";
        consumer_app: "consumer_app";
    }>;
    data_types: z.ZodArray<z.ZodEnum<{
        other: "other";
        pii: "pii";
        phi: "phi";
        code: "code";
        documents: "documents";
        multimedia: "multimedia";
    }>>;
    latency_requirement_ms: z.ZodNumber;
    data_sensitivity: z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        regulated: "regulated";
    }>;
    savings_goal_usd_per_month: z.ZodNumber;
}, z.core.$strip>;
export type Normalized = z.infer<typeof normalizedSchema>;
export declare function POST(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    normalized: {
        company_size: "solo" | "startup" | "smb" | "midmarket" | "enterprise";
        business_model: "other" | "saas" | "marketplace" | "agency" | "consulting" | "consumer_app";
        data_types: ("other" | "pii" | "phi" | "code" | "documents" | "multimedia")[];
        latency_requirement_ms: number;
        data_sensitivity: "low" | "medium" | "high" | "regulated";
        savings_goal_usd_per_month: number;
        current_ai_provider?: "openai" | "anthropic" | "google" | "other";
    };
}> | NextResponse<{
    error: z.core.$ZodIssue[];
}>>;
export {};
