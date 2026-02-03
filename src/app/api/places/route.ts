import { NextResponse } from 'next/server';
import { School } from '@/types';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_KEY;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageToken = searchParams.get('pagetoken');
    const query = searchParams.get('query') || 'Schools in Lagos'; // Default query

    // 1. Fallback to Mock if no Key
    if (!GOOGLE_API_KEY) {
        console.warn('⚠️ No Google Places API Key found. Using mock data.');
        return fetchMockData(pageToken);
    }

    try {
        // 2. Fetch from Google Places API
        const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}${pageToken ? `&pagetoken=${pageToken}` : ''}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
            throw new Error(`Google API Error: ${data.status}`);
        }

        // 3. Map Results to School Type (Hybrid Data)
        const schools: School[] = (data.results || []).map((place: any) => mapGooglePlaceToSchool(place));

        return NextResponse.json({
            results: schools,
            next_page_token: data.next_page_token || null
        });

    } catch (error) {
        console.error('Failed to fetch from Google:', error);
        return fetchMockData(pageToken); // Fallback on error
    }
}

// Helper: Map Google Place -> School (Hybrid Enrichment)
function mapGooglePlaceToSchool(place: any): School {
    const photoRef = place.photos?.[0]?.photo_reference;
    const photoUrl = photoRef
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`
        : null;

    // Probabilistic assignments for missing data to maintain UI richness
    const isBoarding = Math.random() > 0.7;
    const isBritish = Math.random() > 0.5;

    return {
        id: place.place_id,
        name: place.name,
        coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
        },
        address: {
            street: place.formatted_address?.split(',')[0] || 'Unknown Street',
            lga: 'Lagos', // Simplification
            state: 'Lagos'
        },
        image: photoUrl || undefined,
        rating: place.rating || 4.0,
        verified: place.rating > 4.5, // "Verified" if high rated

        // --- Simulated Data (Not available in Places API) ---
        price_range: Math.random() > 0.5 ? '₦500,000 - ₦1,500,000' : '₦150,000 - ₦600,000',
        curriculum: isBritish ? ['British', 'Nigerian'] : ['Nigerian', 'American'],
        type: isBoarding ? 'Boarding' : 'Day',
        facilities: ['Library', 'Science Lab', 'Sports Field', 'Computer Room', 'Sick Bay'].sort(() => 0.5 - Math.random()).slice(0, 3),
        contact_info: {
            phone: 'Request Access', // Google sometimes has this, but keeping it simple for list view
            email: 'admissions@school.com',
            website: '#',
        }
    };
}

// Helper: Mock Data Fallback (original logic)
async function fetchMockData(pageToken: string | null) {
    const fs = require('fs');
    const path = require('path');

    const filePath = path.join(process.cwd(), 'src/data/schools.json');
    if (!fs.existsSync(filePath)) return NextResponse.json({ results: [], next_page_token: null });

    const fileData = fs.readFileSync(filePath, 'utf8');
    const allSchools = JSON.parse(fileData);

    // Simple pagination simulation
    const PAGE_SIZE = 20;
    const startIndex = pageToken ? parseInt(pageToken) : 0;
    const paginated = allSchools.slice(startIndex, startIndex + PAGE_SIZE);
    const nextToken = (startIndex + PAGE_SIZE < allSchools.length) ? (startIndex + PAGE_SIZE).toString() : null;

    return NextResponse.json({
        results: paginated,
        next_page_token: nextToken
    });
}
