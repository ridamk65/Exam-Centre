import { NextResponse } from 'next/server';
import { MOCK_LOGS } from '@/lib/constants';

export async function GET() {
    try {
        // In production, this would fetch from blockchain
        // For now, return mock data
        return NextResponse.json({
            success: true,
            logs: MOCK_LOGS,
            count: MOCK_LOGS.length,
        });
    } catch (error) {
        console.error('Logs API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
