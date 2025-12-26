
export interface School {
    id: number;
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
    price_range: string;
    curriculum: string[];
    facilities: string[];
    verified: boolean;
    contact_info: {
        phone: string;
        email: string;
    };
    type: string;
}
