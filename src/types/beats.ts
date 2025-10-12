// src/types/beats.ts
export interface Beat {
    id: number;
    title: string;
    genre: string;
    artwork: string; // Path to the artwork image (relative to public)
    audioPreview: string; // Path to the audio preview (relative to public)
    fullAudioId: number; // ID for the full audio file
    price: number;
    license: License; // Single license
    isSold: boolean; // True if sold, hide buy but keep sample
}

export interface License {
    id: number;
    name: string;
    price: number;
    description: string;
    paymentLink: string; // Ensure this property exists
}
