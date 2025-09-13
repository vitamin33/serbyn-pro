'use client';

import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Clock, Target, Activity } from 'lucide-react';

// Fetcher for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

interface CategoryDetails {
  count: number;
  avg_impact?: number;
  total_value?: number;
}

interface PortfolioStats {
  total_achievements: number;
  total_value_generated: number;
  total_time_saved_hours: number;
  average_impact_score: number;
  average_complexity_score: number;
  by_category: {
    [key: string]: number | CategoryDetails;
  };
}

interface LivePortfolioMetricsProps {
  fallbackToStatic?: boolean;
}

export function LivePortfolioMetrics({
  fallbackToStatic = true,
}: LivePortfolioMetricsProps) {
  const {
    data: statsData,
    error,
    isLoading,
  } = useSWR<PortfolioStats>(
    `${process.env.NEXT_PUBLIC_ACHIEVEMENT_API_URL}/achievements/stats/summary`,
    fetcher,
    {
      refreshInterval: 60000, // 1 minute refresh
      revalidateOnFocus: false,
      onError: err => {
        console.error('📊 Portfolio stats API failed:', err.message);
        console.log(
          '🔗 Stats URL:',
          `${process.env.NEXT_PUBLIC_ACHIEVEMENT_API_URL}/achievements/stats/summary`
        );
      },
      onSuccess: data => {
        console.log(
          '📈 Portfolio stats loaded:',
          data?.total_achievements || 0,
          'achievements'
        );
        console.log('💰 Total value:', data?.total_value_generated || 0);
      },
    }
  );

  const formatCurrency = (value: number): string => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Fallback data when API is unavailable
  const fallbackData = {
    total_achievements: 4,
    total_value_generated: 275000,
    total_time_saved_hours: 120,
    average_impact_score: 85.0,
    average_complexity_score: 82.0,
    by_category: {
      business: 1,
      feature: 2,
      optimization: 1,
    },
  };

  const displayData = statsData || (fallbackToStatic ? fallbackData : null);

  if (isLoading && !displayData) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            Loading Portfolio Metrics...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-muted/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!displayData) {
    return (
      <Card className="border-2 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            Portfolio Metrics Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Unable to load live portfolio metrics. Please check API
            connectivity.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isLive = statsData && !error;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}
            />
            Portfolio Metrics {isLive ? '(Live)' : '(Static)'}
          </CardTitle>
          <Badge variant={isLive ? 'default' : 'secondary'}>
            {displayData.total_achievements} Achievements
          </Badge>
        </div>
        {isLive && (
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-green-50">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(displayData.total_value_generated)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Total Business Value
            </p>
          </div>

          <div className="text-center p-3 rounded-lg bg-blue-50">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-xl font-bold text-blue-600">
                {displayData.average_impact_score.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Avg Impact Score</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-purple-50">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-purple-600 mr-1" />
              <span className="text-xl font-bold text-purple-600">
                {displayData.total_time_saved_hours}h
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Time Saved</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-orange-50">
            <div className="flex items-center justify-center mb-1">
              <Activity className="h-4 w-4 text-orange-600 mr-1" />
              <span className="text-xl font-bold text-orange-600">
                {displayData.total_achievements}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Total Projects</p>
          </div>
        </div>

        {/* Categories Breakdown */}
        {displayData.by_category &&
          Object.keys(displayData.by_category).length > 0 && (
            <div className="pt-4 border-t mt-4">
              <h4 className="text-sm font-medium mb-2">Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(displayData.by_category)
                  .slice(0, 4)
                  .map(([category, count]) => (
                    <div key={category} className="p-2 rounded bg-muted/50">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium capitalize">
                          {category}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {typeof count === 'number'
                            ? count
                            : (count as CategoryDetails).count || 0}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {typeof count === 'number' ? (
                          `${count} achievements`
                        ) : (
                          <>
                            Avg:{' '}
                            {(count as CategoryDetails).avg_impact?.toFixed(
                              1
                            ) || 'N/A'}{' '}
                            •{' '}
                            {formatCurrency(
                              (count as CategoryDetails).total_value || 0
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
