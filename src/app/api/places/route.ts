import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { School } from '@/types';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageToken = searchParams.get('pagetoken');

    // Load Schools from JSON (Robust Source)
    const filePath = path.join(process.cwd(), 'src/data/schools.json');
    let allSchools: School[] = [];

    try {
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            allSchools = JSON.parse(fileData);
        } else {
            console.error('schools.json not found');
            return NextResponse.json({ results: [], next_page_token: null });
        }
    } catch (err) {
        console.error('Failed to load schools.json', err);
        return NextResponse.json({ results: [], next_page_token: null }, { status: 500 });
    }

    // Pagination Logic
    const PAGE_SIZE = 20;
    let startIndex = 0;

    if (pageToken) {
        startIndex = parseInt(pageToken);
        if (isNaN(startIndex)) startIndex = 0;
    }

    const paginatedSchools = allSchools.slice(startIndex, startIndex + PAGE_SIZE);
    const nextIndex = startIndex + PAGE_SIZE;
    const nextToken = nextIndex < allSchools.length ? nextIndex.toString() : null;

    // Simulate Network Delay (Optional, for realism)
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
        results: paginatedSchools,
        next_page_token: nextToken
    });
}
