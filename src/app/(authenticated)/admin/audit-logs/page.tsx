'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Loader2 } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'audit-logs'],
    queryFn: async () => {
      const res = await fetch('/api/v1/admin/audit-logs');
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Audit Logs</h1>
        <p className="text-muted-foreground mt-1">Immutable record of all destructive and administrative actions.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={data || []} 
        searchKey="action" 
        searchPlaceholder="Filter by action..."
      />
    </div>
  );
}
