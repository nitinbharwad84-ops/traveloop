'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

interface WelcomePanelProps {
  firstName: string;
}

export function WelcomePanel({ firstName }: WelcomePanelProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Welcome Greeting */}
      <motion.div 
        className="md:col-span-2 space-y-2 flex flex-col justify-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Where are we going next? Start planning your next adventure.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="flex flex-col gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Button asChild size="lg" className="w-full justify-start h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md transition-all">
          <Link href={ROUTES.TRIPS_NEW}>
            <Plus className="mr-2 h-5 w-5" />
            <span className="font-semibold text-base">Create New Trip</span>
          </Link>
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button asChild variant="outline" className="w-full justify-start h-12 border-primary/20 hover:bg-primary/5 transition-all">
            <Link href={ROUTES.AI_PLAN_TRIP}>
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="font-medium">AI Planner</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start h-12 transition-all">
            <Link href={ROUTES.SEARCH_DESTINATIONS}>
              <Compass className="mr-2 h-4 w-4" />
              <span className="font-medium">Discover</span>
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
