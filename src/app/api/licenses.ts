// src/data/licenses.ts

// Define the interface for your license data
export interface License {
    id: number;
    name: string;
    price: number;
    description: string; // Add a description field
  }
  
  // Optional: Sample license data (for development/testing only)
  // Remove this if you're fetching data from your API route
  export const sampleLicenses: License[] = [
    {
      id: 1,
      name: 'Basic',
      price: 0,
      description: 'Basic license for personal use only.',
    },
    {
      id: 2,
      name: 'Premium',
      price: 10,
      description: 'Premium license for commercial use with limited rights.',
    },
    {
      id: 3,
      name: 'Unlimited',
      price: 20,
      description: 'Unlimited license for commercial use with full rights.',
    },
  ];
  