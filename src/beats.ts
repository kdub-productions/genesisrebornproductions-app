// src/beats.ts
export interface Beat {
    id: number;
    title: string;
    genre: string;
    artwork: string; // Path to the artwork image (relative to public)
    audioPreview: string; // Path to the audio preview (relative to public)
    fullAudioId: number; // ID for the full audio file
    price: number;
    licenses: License[]; // Array of available licenses
  }
  
  export interface License {
    id: number;
    name: string;
    price: number;
    description: string;
  }
  
  export const beatsData: Beat[] = [
    {
      id: 1,
      title: "GhostTown",
      genre: "Hip-Hop",
      artwork: "/images/BeatCoverArt/GhostTown.png", // Example path - adjust as needed
      audioPreview: "/audio/previews/GhostTownsample.mp3", // Example path - adjust as needed
      fullAudioId: 1,
      price: 2.00,
      licenses: [
        { id: 1, name: "Standard License", price: 10.99, description: "Standard usage rights" },
      ],
    },
  // {
  //   id: 2,
  //   title: "Another Great Beat",
  //   genre: "Trap",
  //   artwork: "/images/beat-2-artwork.jpg", // Example path - adjust as needed
  //   audioPreview: "/audio/previews/beat-preview-2.mp3", // Example path - adjust as needed
  //   fullAudioId: 2,
  //   price: 75.00,
  //   licenses: [
  //     { id: 1, name: "Standard License", price: 75.00, description: "Standard usage rights" },
  //   ],
  // },
  ];