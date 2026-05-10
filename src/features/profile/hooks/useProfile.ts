import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, ProfileData } from '@/services/profile.service';
import { ProfileInput } from '@/schemas/profile.schema';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function useProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  // Query for getting profile
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  // Update profile
  const updateMutation = useMutation({
    mutationFn: (data: Partial<ProfileInput>) => profileService.updateProfile(data),
    onMutate: async (newData) => {
      // Cancel outgoing fetches
      await queryClient.cancelQueries({ queryKey: ['profile'] });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData(['profile']);

      // Optimistically update to the new value
      queryClient.setQueryData(['profile'], (old: unknown) => {
        const oldData = old as { data: ProfileData } | undefined;
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            ...newData,
          },
        };
      });

      return { previousProfile };
    },
    onError: (err, newData, context) => {
      // Revert if error
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile);
      }
      toast({
        title: 'Update failed',
        description: 'An error occurred while updating your profile.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      // Sync with server
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onSuccess: (res) => {
      if (res.success) {
        toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
      } else {
        toast({
          title: 'Update failed',
          description: res.error?.message || 'Something went wrong',
          variant: 'destructive',
        });
      }
    }
  });

  // Upload Avatar
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        toast({ title: 'Avatar updated', description: 'Your new avatar has been saved.' });
      } else {
        toast({
          title: 'Upload failed',
          description: res.error?.message || 'Failed to upload avatar',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'Upload failed',
        description: 'A network error occurred while uploading your avatar.',
        variant: 'destructive',
      });
    }
  });

  // Delete Account
  const deleteAccountMutation = useMutation({
    mutationFn: () => profileService.deleteAccount(),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.clear();
        router.push('/');
        toast({ title: 'Account deleted', description: 'We are sorry to see you go.' });
      } else {
        toast({
          title: 'Deletion failed',
          description: res.error?.message || 'Could not delete account',
          variant: 'destructive',
        });
      }
    }
  });

  return {
    profile: profileResponse?.success ? profileResponse.data : null,
    isLoading,
    
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeletingAccount: deleteAccountMutation.isPending,
  };
}
