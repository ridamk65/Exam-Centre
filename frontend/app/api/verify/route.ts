import { NextResponse } from 'next/server';
import { verifyPaperHash } from '@/lib/blockchain';
import { camelCaseAttributes } from 'framer-motion';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { paperHash } = body;

        if (!paperHash) {
            return NextResponse.json(
                { valid: false, error: 'Paper hash is required' },
                { status: 400 }
            );
        }

        // Verify against blockchain (mock implementation)
        const result = await verifyPaperHash(paperHash);

        return NextResponse.json({
            valid: result.valid,
            timestamp: result.timestamp,
            message: result.valid ? 'Hash verified successfully' : 'Hash not found on blockchain',
        });
    } catch (error) {
        console.error('Verify API error:', error);
        return NextResponse.json(
            { valid: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
