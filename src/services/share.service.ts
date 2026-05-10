export interface SharedLinkData {
  id: string;
  tripId: string;
  token: string;
  visibility: string;
  expiresAt: string | null;
  createdAt: string;
}

export const shareService = {
  async getShareLinks(tripId: string) {
    const res = await fetch(`/api/v1/trips/${tripId}/share`);
    if (!res.ok) throw new Error('Failed to fetch share links');
    return res.json() as Promise<{ success: boolean; data: SharedLinkData[] }>;
  },

  async createShareLink(tripId: string, data: { visibility: string; expiresAt: string | null }) {
    const res = await fetch(`/api/v1/trips/${tripId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.error || 'Failed to create share link');
    return result as { success: boolean; data: SharedLinkData };
  },

  async revokeShareLink(linkId: string) {
    // Note: The API route is /api/v1/share/[token] but we pass linkId in the URL param
    const res = await fetch(`/api/v1/share/${linkId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to revoke share link');
    return res.json() as Promise<{ success: boolean }>;
  },

  async getPublicTrip(token: string) {
    const res = await fetch(`/api/v1/share/${token}`);
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.error || 'Failed to fetch public trip');
    return result.data; // This returns the actual trip object including nested owner, stops, budgets
  },

  async duplicateTrip(token: string) {
    const res = await fetch(`/api/v1/share/${token}/duplicate`, {
      method: 'POST',
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.error || 'Failed to duplicate trip');
    return result.data;
  }
};
