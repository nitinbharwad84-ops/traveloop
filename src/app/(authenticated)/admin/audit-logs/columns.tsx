'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Timestamp',
    cell: ({ row }) => <span className="text-muted-foreground">{format(new Date(row.getValue('createdAt')), 'PPpp')}</span>,
  },
  {
    accessorKey: 'actor.email',
    header: 'Admin Actor',
    cell: ({ row }) => <span className="font-medium">{row.original.actor?.email || 'System'}</span>,
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      const action = row.getValue('action') as string;
      return (
        <Badge variant={action.includes('delete') || action.includes('suspend') ? 'destructive' : 'secondary'}>
          {action}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'resourceType',
    header: 'Resource',
  },
  {
    accessorKey: 'resourceId',
    header: 'Resource ID',
    cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('resourceId')}</span>,
  },
];
