import { ProfileInput } from '@/schemas/profile.schema';
import { ApiResponse } from '@/types';

// Using a generic Profile type for the frontend
export interface ProfileData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  language: string;
  travelPreferences: string[];
  notificationPreferences: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
  user: {
    email: string;
    _count: {
      trips: number;
    }
  }
}

export const profileService = {
  /**
   * Get the current user's profile
   */
  async getProfile(): Promise<ApiResponse<ProfileData>> {
    const res = await fetch('/api/v1/profile');
    return res.json();
  },

  /**
   * Update the user's profile
   */
  async updateProfile(data: Partial<ProfileInput>): Promise<ApiResponse<ProfileData>> {
    const res = await fetch('/api/v1/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  /**
   * Resize and upload avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<ProfileData>> {
    const resizedBlob = await resizeImageToBlob(file, 256, 256);
    
    const formData = new FormData();
    formData.append('file', resizedBlob, file.name);

    const res = await fetch('/api/v1/profile/avatar', {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  /**
   * Delete account
   */
  async deleteAccount(): Promise<ApiResponse<null>> {
    const res = await fetch('/api/v1/profile/delete', { method: 'DELETE' });
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

        // Calculate aspect ratio
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
        if (!ctx) {
          return reject(new Error('Canvas context not available'));
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Always try to use WebP for smaller size if supported, fallback to JPEG
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Blob conversion failed'));
          }
        }, 'image/jpeg', 0.85); // 85% quality
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}
