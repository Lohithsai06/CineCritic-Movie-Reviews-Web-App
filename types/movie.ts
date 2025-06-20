import { Timestamp } from 'firebase/firestore';

export type Movie = {
  id?: string;
  title: string;
  genres: string[];
  languages: string[];
  censor: 'U' | 'U/A' | 'A';
  rating: number;
  posterUrl: string;
  review: string;
  createdAt: Timestamp;
};