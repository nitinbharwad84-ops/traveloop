'use client';
import { DestinationData } from '@/services/discovery.service';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const BUDGET_LABELS: Record<number, string> = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$', 5: '$$$$$' };

function getImageUrl(city: string) {
  return `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(city)},travel`;
}

export function DestinationCard({ dest }: { dest: DestinationData }) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/10">
      <div className="relative h-48 overflow-hidden">
        <img
          src={dest.imageUrl || getImageUrl(dest.cityName)}
          alt={dest.cityName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://source.unsplash.com/featured/400x300/?travel,city`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {dest.trending && (
          <Badge className="absolute top-3 left-3 bg-orange-500 text-white gap-1">
            <TrendingUp className="h-3 w-3" /> Trending
          </Badge>
        )}
        <Badge className="absolute top-3 right-3 bg-background/90 text-foreground">
          {BUDGET_LABELS[dest.estimatedBudgetIndex] || '$$$'}
        </Badge>
        <div className="absolute bottom-3 left-3">
          <h3 className="text-white font-bold text-lg leading-tight">{dest.cityName}</h3>
          <div className="flex items-center gap-1 text-white/80 text-sm">
            <MapPin className="h-3 w-3" /> {dest.countryName}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        {dest.seasonalRecommendation && (
          <p className="text-xs text-muted-foreground mb-2">Best time: {dest.seasonalRecommendation}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {dest.tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs capitalize">{tag}</Badge>
          ))}
        </div>
        <Link
          href={`/search/activities?q=${encodeURIComponent(dest.cityName)}`}
          className="mt-3 block text-xs text-primary font-medium hover:underline"
        >
          Browse activities →
        </Link>
      </CardContent>
    </Card>
  );
}
