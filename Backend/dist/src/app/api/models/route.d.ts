import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    error: any;
}> | NextResponse<{
    models: any;
}>>;
