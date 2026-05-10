export interface PackingItemData {
  id: string;
  tripId: string;
  name: string;
  category: string;
  packed: boolean;
  createdAt: string;
}

export const packingService = {
  async getItems(tripId: string) {
    const res = await fetch(`/api/v1/trips/${tripId}/packing`);
    if (!res.ok) throw new Error('Failed to fetch packing items');
    return res.json() as Promise<{ success: boolean; data: PackingItemData[] }>;
  },

  async addItem(tripId: string, data: { name: string; category: string }) {
    const res = await fetch(`/api/v1/trips/${tripId}/packing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add item');
    return res.json() as Promise<{ success: boolean; data: PackingItemData }>;
  },

  async duplicateChecklist(tripId: string, sourceTripId: string) {
    const res = await fetch(`/api/v1/trips/${tripId}/packing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceTripId }),
    });
    if (!res.ok) throw new Error('Failed to duplicate checklist');
    return res.json() as Promise<{ success: boolean; data: PackingItemData[] }>;
  },

  async updateItem(itemId: string, data: { name?: string; category?: string; packed?: boolean }) {
    const res = await fetch(`/api/v1/packing/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update item');
    return res.json() as Promise<{ success: boolean; data: PackingItemData }>;
  },

  async deleteItem(itemId: string) {
    const res = await fetch(`/api/v1/packing/${itemId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete item');
    return res.json() as Promise<{ success: boolean }>;
  },

  async resetChecklist(tripId: string) {
    const res = await fetch(`/api/v1/trips/${tripId}/packing/reset`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset checklist');
    return res.json() as Promise<{ success: boolean }>;
  },
};
