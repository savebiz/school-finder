
export interface School {
    id: string | number;
    name: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    address: {
        street: string;
        lga: string;
        state: string;
    };
    price_range?: string;
    curriculum?: string[];
    facilities?: string[];
    verified: boolean;
    contact_info: {
        phone: string;
        email: string;
        website?: string;
    };
    type?: string;
    image?: string;
    rating?: number;
}
