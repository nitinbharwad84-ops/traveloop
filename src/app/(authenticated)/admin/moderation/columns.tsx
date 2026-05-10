'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns = (onRemove: (id: string) => void): ColumnDef<any>[] => [
  {
    accessorKey: 'trip.title',
    header: 'Trip Title',
    cell: ({ row }) => <span className="font-medium">{row.original.trip?.title}</span>,
  },
  {
    accessorKey: 'user.email',
    header: 'Author Email',
  },
  {
    accessorKey: 'createdAt',
    header: 'Published At',
    cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'PP'),
  },
  {
    accessorKey: 'visibility',
    header: 'Visibility',
    cell: ({ row }) => <Badge variant="secondary">{row.getValue('visibility')}</Badge>,
  },
  {
    accessorKey: '_count.likes',
    header: 'Likes',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const post = row.original;
      return (
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onRemove(post.id)}
          className="h-8"
        >
          <Trash className="h-3.5 w-3.5 mr-1" /> Remove Post
        </Button>
      );
    },
  },
];
