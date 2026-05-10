'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plane, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

export function EmptyDashboardState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col items-center justify-center p-8 text-center min-h-[40vh] bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/30"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
        <Plane className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">No trips planned yet</h2>
      <p className="text-muted-foreground max-w-sm mb-8 text-lg">
        It looks like you haven&apos;t planned any adventures. Create your first trip and start exploring the world!
      </p>
      <Button asChild size="lg" className="h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
        <Link href={ROUTES.TRIPS_NEW}>
          <Plus className="mr-2 h-5 w-5" />
          Create your first trip
        </Link>
      </Button>
    </motion.div>
  );
}
