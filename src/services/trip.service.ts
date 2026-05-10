import { ApiResponse } from '@/types';

export interface TripBudget {
  id: string;
  category: string;
  estimatedAmount: number;
  actualAmount: number;
}

export interface TripData {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  travelerCount: number;
  status: 'draft' | 'active' | 'completed' | 'archived';
  _count: {
    stops: number;
    collaborators: number;
  };
  budgets: TripBudget[];
}

export const tripService = {
  async getRecentTrips(limit: number = 6): Promise<ApiResponse<TripData[]>> {
    const res = await fetch(`/api/v1/trips?filter=recent&limit=${limit}`);
    return res.json();
  },

  async getUpcomingTrips(limit: number = 10): Promise<ApiResponse<TripData[]>> {
    const res = await fetch(`/api/v1/trips?filter=upcoming&limit=${limit}`);
    return res.json();
  }
};
