'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BudgetAlert {
  tripId: string;
  tripTitle: string;
  totalEstimated: number;
  totalActual: number;
  overage: number;
  percentUsed: number;
}

interface BudgetAlertsProps {
  alerts: BudgetAlert[];
}

export function BudgetAlerts({ alerts }: BudgetAlertsProps) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <h2 className="text-xl font-semibold tracking-tight">Budget Alerts</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alerts.map((alert) => (
          <Card key={alert.tripId} className="border-destructive/20 bg-destructive/5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base line-clamp-1">{alert.tripTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Wallet className="h-3 w-3" /> Estimated</p>
                  <p className="font-medium">${alert.totalEstimated.toLocaleString()}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs text-destructive flex items-center gap-1 justify-end"><TrendingUp className="h-3 w-3" /> Actual</p>
                  <p className="font-bold text-destructive">${alert.totalActual.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-destructive">{alert.percentUsed}% used</span>
                  <span className="text-destructive font-bold">+${alert.overage.toLocaleString()}</span>
                </div>
                {/* Progress bar capped at 100% visually */}
                <Progress value={Math.min(alert.percentUsed, 100)} className="h-2 bg-destructive/20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
