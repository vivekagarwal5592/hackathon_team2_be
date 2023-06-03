export interface Blog {
    id?: number ;
    title: string;
    description: string;
    published: boolean;
    slug: string;
    createdAt: string;
    updatedAt: string;
    keywords: string;
    user?: {
        id: string;
        name: string;
        email: string;
        url: string;
        about: string;
        image: string;
    };
    image?: {
        id: string;
        name: string;
    };
    detailedInstruction: any[];
    itinerary: any[];
    tag: string;
    place: string;
}



