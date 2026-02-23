export interface Order {
  id: string;
  client: string;
  transport: 'avion' | 'bateau' | 'mix';
  realPrice: number;
  clientPrice: number;
  profit: number;
  dateOrder: string;
  dateArrival: string;
  datePickup: string;
  dateDelivery: string;
  status: 'encours' | 'arrive' | 'recupere' | 'livre';
  photos: string[];
  rating: number;
  review: string;
  suggestions: string;
  createdAt: number;
}

export type Lang = 'fr' | 'en';
export type Theme = 'dark' | 'light';
export type Screen = 'onboarding' | 'pin' | 'splash' | 'app';

export const TRANSPORT_OPTIONS = ['avion', 'bateau', 'mix'] as const;
export const STATUS_OPTIONS = ['encours', 'arrive', 'recupere', 'livre'] as const;
