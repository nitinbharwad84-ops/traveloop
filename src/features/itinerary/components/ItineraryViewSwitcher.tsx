'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlignLeft, CalendarDays, Map as MapIcon, List, Clock } from 'lucide-react';

interface ItineraryViewSwitcherProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function ItineraryViewSwitcher({ currentView, onViewChange }: ItineraryViewSwitcherProps) {
  return (
    <Tabs value={currentView} onValueChange={onViewChange} className="w-full overflow-x-auto print:hidden">
      <TabsList className="h-12 w-full justify-start md:justify-center p-1 bg-muted/50 rounded-xl">
        <TabsTrigger value="timeline" className="rounded-lg h-full flex-1 md:flex-none min-w-[100px]">
          <AlignLeft className="h-4 w-4 mr-2 hidden sm:block" /> Timeline
        </TabsTrigger>
        <TabsTrigger value="day" className="rounded-lg h-full flex-1 md:flex-none min-w-[100px]">
          <Clock className="h-4 w-4 mr-2 hidden sm:block" /> Day View
        </TabsTrigger>
        <TabsTrigger value="list" className="rounded-lg h-full flex-1 md:flex-none min-w-[100px]">
          <List className="h-4 w-4 mr-2 hidden sm:block" /> List
        </TabsTrigger>
        <TabsTrigger value="calendar" className="rounded-lg h-full flex-1 md:flex-none min-w-[100px]">
          <CalendarDays className="h-4 w-4 mr-2 hidden sm:block" /> Calendar
        </TabsTrigger>
        <TabsTrigger value="map" className="rounded-lg h-full flex-1 md:flex-none min-w-[100px]">
          <MapIcon className="h-4 w-4 mr-2 hidden sm:block" /> Map
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
