const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const OUTPUT_FILE = path.join(__dirname, '../src/data/schools.json');
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_KEY; // Optional: Uses Mock if missing
const LOCATIONS = ['Lekki, Lagos', 'Ikeja, Lagos', 'Victoria Island, Lagos', 'Surulere, Lagos'];

// Mock Data Generators
const SCHOOL_NAMES = [
    'Grace Springs College', 'Imperial Lights College', 'Pinefield Schools', 'Meadow Hall',
    'Greensprings School', 'Corona School', 'Chrisland School', 'Dowen College',
    'British International School', 'Lekki British School', 'Whitesands School',
    'Grange School', 'St. Saviours School', 'Children International School',
    'Riverbank School', 'Emerald Schools', 'Rainbow College', 'Temple School'
];

const CURRICULUMS = ['British', 'Nigerian', 'American', 'Montessori', 'IB', 'Christian'];
const FACILITIES = ['Swimming Pool', 'Tech Lab', 'Music Room', 'Sports Field', 'Art Studio', 'Boarding', 'Bus Service', 'Sick Bay', 'Library'];

// Helper to generate a random school (Mock Mode)
function generateMockSchool(index) {
    const nameBase = SCHOOL_NAMES[index % SCHOOL_NAMES.length];
    const nameSuffix = Math.floor(index / SCHOOL_NAMES.length) > 0 ? ` ${Math.floor(index / SCHOOL_NAMES.length) + 1}` : '';

    const locationIdx = index % LOCATIONS.length;
    // Distribute lat/lng slightly around Lagos centers
    const baseLat = 6.45 + (Math.random() * 0.2);
    const baseLng = 3.40 + (Math.random() * 0.2);

    return {
        id: `gmap-${index + 1}`,
        name: `${nameBase}${nameSuffix}`,
        coordinates: {
            lat: parseFloat(baseLat.toFixed(6)),
            lng: parseFloat(baseLng.toFixed(6))
        },
        address: {
            street: `${Math.floor(Math.random() * 100) + 1} Random Street`,
            lga: LOCATIONS[locationIdx].split(',')[0],
            state: 'Lagos'
        },
        price_range: Math.random() > 0.3 ? `₦${(300 + Math.floor(Math.random() * 1700)) * 1000} - ₦${(2000 + Math.floor(Math.random() * 1000)) * 1000}` : undefined,
        curriculum: Math.random() > 0.2 ? [CURRICULUMS[index % CURRICULUMS.length], 'Nigerian'] : undefined,
        facilities: FACILITIES.filter(() => Math.random() > 0.5),
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), // 3.5 to 5.0
        verified: index < 5, // First 5 are "verified"
        contact_info: {
            phone: `+234 8${Math.floor(Math.random() * 10)}0 000 0000`,
            email: `info@${nameBase.replace(/\s+/g, '').toLowerCase()}.com`,
            website: `https://${nameBase.replace(/\s+/g, '').toLowerCase()}.com`
        },
        type: index % 3 === 0 ? 'Boarding' : 'Day',
        image: null // Frontend handles placeholders
    };
}

async function seed() {
    console.log('🌱 Starting Seed Process...');

    let schools = [];

    if (GOOGLE_API_KEY) {
        console.log('🌍 GOOGLE_PLACES_KEY found. Fetching real data...');
        // Implementation for Real API would go here (fetch from Google Places Text Search)
        // For now, we fallback to Mock to ensure robust behavior first.
        console.warn('⚠️ Real API implementation pending. Falling back to robust generation.');
    } else {
        console.log('⚠️ No API Key found. Generating robust mock data...');
    }

    // Generate 100 Schools
    for (let i = 0; i < 100; i++) {
        schools.push(generateMockSchool(i));
    }

    // Write to File
    try {
        const data = JSON.stringify(schools, null, 2);
        fs.writeFileSync(OUTPUT_FILE, data);
        console.log(`✅ Successfully seeded ${schools.length} schools to ${OUTPUT_FILE}`);
    } catch (err) {
        console.error('❌ Failed to write schools.json:', err);
        process.exit(1);
    }
}

seed();
