export interface DestinationData {
  id: string;
  cityName: string;
  countryName: string;
  region: string | null;
  destinationType: string;
  estimatedBudgetIndex: number;
  seasonalRecommendation: string | null;
  highlights: string[];
  tags: string[];
  imageUrl: string | null;
  trending: boolean;
}

export interface ActivityData {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  locationJson: unknown;
  estimatedCost: number | null;
  estimatedDuration: number | null;
  rating: number | null;
  metadata: unknown;
}

export interface SearchMeta { total: number; page: number; limit: number; totalPages: number; }

export const discoveryService = {
  async searchDestinations(params: Record<string, string>) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`/api/v1/search/destinations?${qs}`);
    return res.json() as Promise<{ success: boolean; data: DestinationData[]; meta: SearchMeta }>;
  },
  async searchActivities(params: Record<string, string>) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`/api/v1/search/activities?${qs}`);
    return res.json() as Promise<{ success: boolean; data: ActivityData[]; meta: SearchMeta }>;
  },
};
