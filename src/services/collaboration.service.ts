export interface CollaboratorData {
  id: string;
  tripId: string;
  userId: string;
  role: string;
  status: string;
  invitedBy: string | null;
  joinedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    profile: {
      firstName: string | null;
      lastName: string | null;
      avatarUrl: string | null;
    } | null;
  };
}

export const collaborationService = {
  async getCollaborators(tripId: string) {
    const res = await fetch(`/api/v1/trips/${tripId}/collaborators`);
    if (!res.ok) throw new Error('Failed to fetch collaborators');
    return res.json() as Promise<{ success: boolean; data: CollaboratorData[] }>;
  },

  async inviteCollaborator(tripId: string, email: string, role: string) {
    const res = await fetch(`/api/v1/trips/${tripId}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.error || 'Failed to invite collaborator');
    return result as { success: boolean; data: CollaboratorData };
  },

  async updateCollaborator(collabId: string, data: { role?: string; status?: string }) {
    const res = await fetch(`/api/v1/collaborators/${collabId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update collaborator');
    return res.json() as Promise<{ success: boolean; data: CollaboratorData }>;
  },

  async removeCollaborator(collabId: string) {
    const res = await fetch(`/api/v1/collaborators/${collabId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove collaborator');
    return res.json() as Promise<{ success: boolean }>;
  },
};
