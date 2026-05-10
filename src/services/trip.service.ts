import { ApiResponse } from '@/types';
import { TripInput } from '@/schemas/trip.schema';

export interface TripBudget {
  id: string;
  category: string;
  estimatedAmount: number;
  actualAmount: number;
  currency: string;
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
  budgetTarget: number | null;
  currency: string;
  tripType: 'solo' | 'family' | 'group' | 'honeymoon' | 'business' | 'adventure' | 'luxury' | 'budget';
  privacy: 'private' | 'shared' | 'public';
  status: 'draft' | 'active' | 'completed' | 'archived';
  transportPreference: string | null;
  accommodationPreference: string | null;
  originCity: string | null;
  _count: {
    stops: number;
    collaborators: number;
  };
  budgets: TripBudget[];
}

export interface GetTripsFilters {
  status?: string;
  q?: string;
  sort?: string;
  limit?: number;
}

export const tripService = {
  async getTrips(filters?: GetTripsFilters): Promise<ApiResponse<TripData[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.q) params.append('q', filters.q);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const res = await fetch(`/api/v1/trips?${params.toString()}`);
    return res.json();
  },

  async getRecentTrips(limit: number = 6): Promise<ApiResponse<TripData[]>> {
    const res = await fetch(`/api/v1/trips?filter=recent&limit=${limit}`);
    return res.json();
  },

  async getUpcomingTrips(limit: number = 10): Promise<ApiResponse<TripData[]>> {
    const res = await fetch(`/api/v1/trips?filter=upcoming&limit=${limit}`);
    return res.json();
  },

  async getTrip(tripId: string): Promise<ApiResponse<TripData>> {
    const res = await fetch(`/api/v1/trips/${tripId}`);
    return res.json();
  },

  async createTrip(data: TripInput): Promise<ApiResponse<TripData>> {
    const res = await fetch('/api/v1/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateTrip(tripId: string, data: Partial<TripInput>): Promise<ApiResponse<TripData>> {
    const res = await fetch(`/api/v1/trips/${tripId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteTrip(tripId: string): Promise<ApiResponse<null>> {
    const res = await fetch(`/api/v1/trips/${tripId}`, { method: 'DELETE' });
    return res.json();
  },

  async duplicateTrip(tripId: string): Promise<ApiResponse<TripData>> {
    const res = await fetch(`/api/v1/trips/${tripId}/duplicate`, { method: 'POST' });
    return res.json();
  },

  async archiveTrip(tripId: string): Promise<ApiResponse<TripData>> {
    const res = await fetch(`/api/v1/trips/${tripId}/archive`, { method: 'POST' });
    return res.json();
  },

  async uploadCover(tripId: string, file: File): Promise<ApiResponse<TripData>> {
    const resizedBlob = await resizeImageToBlob(file, 1200, 800);
    const formData = new FormData();
    formData.append('file', resizedBlob, file.name);

    const res = await fetch(`/api/v1/trips/${tripId}/cover`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  }
};

/**
 * Resizes an image file using the Canvas API
 */
function resizeImageToBlob(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not available'));

        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Blob conversion failed'));
        }, 'image/jpeg', 0.85);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}
