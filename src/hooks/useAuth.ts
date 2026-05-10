import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from '@/schemas/auth.schema';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Query for getting current user
  const { data: userResponse, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        router.push('/dashboard');
        router.refresh(); // Refresh to apply middleware and layout changes
      }
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        router.push('/dashboard');
        router.refresh();
      }
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
      router.push('/login');
      router.refresh();
    },
  });

  // Forgot Password Mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordInput) => authService.forgotPassword(data),
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordInput) => authService.resetPassword(data),
    onSuccess: (res) => {
      if (res.success) {
        router.push('/login?reset=success');
      }
    },
  });

  return {
    user: userResponse?.success ? userResponse.data?.user : null,
    isLoadingUser,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.data?.success === false ? loginMutation.data.error : null,
    
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.data?.success === false ? registerMutation.data.error : null,
    
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isSendingReset: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.data?.success === false ? forgotPasswordMutation.data.error : null,
    forgotPasswordSuccess: forgotPasswordMutation.data?.success === true,
    
    resetPassword: resetPasswordMutation.mutateAsync,
    isResetting: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.data?.success === false ? resetPasswordMutation.data.error : null,
  };
}
