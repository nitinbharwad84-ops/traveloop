export const communityService = {
  async getFeed(params: { cursor?: string; limit?: number; sort?: string }) {
    const query = new URLSearchParams();
    if (params.cursor) query.set('cursor', params.cursor);
    if (params.limit) query.set('limit', String(params.limit));
    if (params.sort) query.set('sort', params.sort);
    const res = await fetch(`/api/v1/community/feed?${query.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return { posts: data.data, nextCursor: data.nextCursor };
  },

  async publishPost(tripId: string, content?: string) {
    const res = await fetch('/api/v1/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, content }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getUserPosts(userId?: string) {
    const url = userId
      ? `/api/v1/community/posts?userId=${userId}`
      : '/api/v1/community/posts';
    const res = await fetch(url);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async toggleLike(postId: string) {
    const res = await fetch('/api/v1/community/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data as { liked: boolean };
  },

  async getComments(postId: string) {
    const res = await fetch(`/api/v1/community/comments?postId=${postId}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async addComment(postId: string, content: string) {
    const res = await fetch('/api/v1/community/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async toggleFollow(targetUserId: string) {
    const res = await fetch('/api/v1/community/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data as { following: boolean };
  },

  async getUserProfile(userId: string) {
    const res = await fetch(`/api/v1/community/users/${userId}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async copyTrip(tripId: string) {
    // Use the existing share/duplicate mechanism by first creating a share link then duplicating
    // For community, we do a direct copy via the trips API pattern
    const res = await fetch('/api/v1/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _copyFromTripId: tripId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },
};
