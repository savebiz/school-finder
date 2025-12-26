import { NextResponse } from 'next/server';

// Mock database to simulate "All Google Maps" data
const MOCK_GOOGLE_DATA = Array.from({ length: 60 }).map((_, i) => ({
    id: `gmap-${i + 1}`,
    name: `School ${i + 1} (Google Result)`,
    coordinates: {
        lat: 6.45 + (Math.random() * 0.1),
        lng: 3.4 + (Math.random() * 0.1)
    },
    address: {
        street: `${Math.floor(Math.random() * 100)} Maps St, Lagos`,
        lga: i % 2 === 0 ? "Lekki" : "Ikeja",
        state: "Lagos"
    },
    rating: (3 + Math.random() * 2).toFixed(1), // Random rating 3.0 - 5.0
    verified: false,
    contact_info: {
        phone: "+234 800 000 0000",
        email: ""
    },
    type: "Day", // Default for Google results
    price_range: undefined, // Google doesn't have this
    curriculum: undefined, // Google doesn't have this
    facilities: undefined // Google doesn't have this
}));

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageToken = searchParams.get('pagetoken');
    const pageSize = 10;

    // Simulate pagination
    let startIndex = 0;
    if (pageToken) {
        startIndex = parseInt(pageToken);
    }

    const nextIndex = startIndex + pageSize;
    const results = MOCK_GOOGLE_DATA.slice(startIndex, nextIndex);

    const nextPageToken = nextIndex < MOCK_GOOGLE_DATA.length ? nextIndex.toString() : null;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
        results,
        next_page_token: nextPageToken
    });
}
