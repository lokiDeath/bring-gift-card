/**
 * Shared types between client and server.
 * Keep this file free of runtime code so it can be imported from anywhere.
 */

export type UserRole = "master" | "staff";

export interface User {
  id: number;
  username: string;
  role: UserRole;
  createdAt: string;
}

export interface GiftCard {
  id: number;
  brand: string;
  slug: string;
  imageUrl: string;
  baseRate: number;       // e.g. 0.82 means $100 card → $82 payout
  isActive: boolean;
  updatedAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  details?: string;
}
