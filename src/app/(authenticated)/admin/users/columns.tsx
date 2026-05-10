'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ShieldBan, Trash, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns = (onSuspend: (id: string, status: string) => void, onDelete: (id: string) => void): ColumnDef<any>[] => [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'profile.firstName',
    header: 'First Name',
    cell: ({ row }) => row.original.profile?.firstName || 'N/A',
  },
  {
    accessorKey: 'profile.lastName',
    header: 'Last Name',
    cell: ({ row }) => row.original.profile?.lastName || 'N/A',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'default' : status === 'suspended' ? 'destructive' : 'secondary'}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: '_count.trips',
    header: 'Trips',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      return (
        <Badge variant="outline" className={role === 'admin' ? 'border-primary text-primary' : ''}>
          {role}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user.status === 'active' ? (
              <DropdownMenuItem onClick={() => onSuspend(user.id, 'suspended')} className="text-orange-600">
                <ShieldBan className="h-4 w-4 mr-2" /> Suspend User
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onSuspend(user.id, 'active')} className="text-green-600">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Unsuspend User
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-destructive">
              <Trash className="h-4 w-4 mr-2" /> Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
