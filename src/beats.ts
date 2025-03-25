// src/beats.ts
export interface Beat {
    id: number;
    title: string;
    genre: string;
    artwork: string; // Path to the artwork image (relative to public)
    audioPreview: string; // Path to the audio preview (relative to public)
    fullAudioId: number; // ID for the full audio file
    price: number;
    license: License; // Single license
}

export interface License {
    id: number;
    name: string;
    price: number;
    description: string;
    paymentLink: string; // Ensure this property exists
}

// Example Beat Data
export const beatsData: Beat[] = [
  {
    id: 1,
    title: "GhostTown",
    genre: "Hip-Hop",
    artwork: "/images/BeatCoverArt/GhostTown.png",
    audioPreview: "/audio/previews/GhostTownsample.mp3",
    fullAudioId: 1,
    price: 2.00,
    license: { id: 1, name: "Standard License", price: 2.00, description: "Standard usage rights", paymentLink: "https://buy.stripe.com/00g8A3f7e8KT0BqeUU" },
  },
  {
    id: 2,
    title: "Better Days",
    genre: "Hip-Hop",
    artwork: "/images/BeatCoverArt/BetterDays.jpg",
    audioPreview: "/audio/previews/BetterDaysSample.mp3",
    fullAudioId: 2,
    price: 5.00,
    license: { id: 1, name: "Standard License", price: 5.00, description: "Standard usage rights", paymentLink: "https://buy.stripe.com/aEU5nR4sA6CL4RGeUV" },
  },
];