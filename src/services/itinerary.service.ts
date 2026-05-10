import { ApiResponse } from '@/types';
import { TripStopInput, TripStopUpdateInput, TripActivityInput, TripActivityUpdateInput, ReorderInput } from '@/schemas/itinerary.schema';

export interface TripActivityData {
  id: string;
  tripStopId: string;
  activityId: string | null;
  title: string;
  description: string | null;
  dayNumber: number;
  timeSlot: string | null;
  customNotes: string | null;
  customCost: number | null;
  orderIndex: number;
}

export interface TripStopData {
  id: string;
  tripId: string;
  cityName: string;
  countryName: string;
  arrivalDate: string | null;
  departureDate: string | null;
  timezone: string | null;
  orderIndex: number;
  notes: string | null;
  estimatedTransportCost: number | null;
  estimatedTransportTime: number | null;
  tripActivities: TripActivityData[];
}

export const itineraryService = {
  async getStops(tripId: string): Promise<ApiResponse<TripStopData[]>> {
    const res = await fetch(`/api/v1/trips/${tripId}/stops`);
    return res.json();
  },

  async addStop(tripId: string, data: TripStopInput): Promise<ApiResponse<TripStopData>> {
    const res = await fetch(`/api/v1/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateStop(stopId: string, data: TripStopUpdateInput): Promise<ApiResponse<TripStopData>> {
    const res = await fetch(`/api/v1/stops/${stopId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteStop(stopId: string): Promise<ApiResponse<null>> {
    const res = await fetch(`/api/v1/stops/${stopId}`, { method: 'DELETE' });
    return res.json();
  },

  async reorderStops(tripId: string, data: ReorderInput): Promise<ApiResponse<null>> {
    const res = await fetch(`/api/v1/trips/${tripId}/stops/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async addActivity(stopId: string, data: TripActivityInput): Promise<ApiResponse<TripActivityData>> {
    const res = await fetch(`/api/v1/stops/${stopId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateActivity(activityId: string, data: TripActivityUpdateInput): Promise<ApiResponse<TripActivityData>> {
    const res = await fetch(`/api/v1/trip-activities/${activityId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteActivity(activityId: string): Promise<ApiResponse<null>> {
    const res = await fetch(`/api/v1/trip-activities/${activityId}`, { method: 'DELETE' });
    return res.json();
  }
};
