'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminModerationPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'moderation'],
    queryFn: async () => {
      const res = await fetch('/api/v1/admin/moderation');
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/admin/moderation?postId=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      toast.success('Community post removed');
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation'] });
    },
    onError: () => toast.error('Failed to remove post'),
  });

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Community Moderation</h1>
        <p className="text-muted-foreground mt-1">Review public community posts and enforce content guidelines.</p>
      </div>

      <DataTable 
        columns={columns(
          (id) => { if (confirm('Remove this post from the community feed?')) removeMutation.mutate(id) }
        )} 
        data={data || []} 
        searchKey="user_email" // Note: client side filtering requires specific setup for nested. For simplicity, we just pass data.
      />
    </div>
  );
}
