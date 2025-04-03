
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardStatProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  className?: string;
}

const CardStat: React.FC<CardStatProps> = ({
  title,
  value,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <p className={`text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}% del mes anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CardStat;
