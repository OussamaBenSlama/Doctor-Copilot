
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Smartphone, Globe, BarChartHorizontal } from 'lucide-react';

interface UsageStatsProps {
  metadata: {
    total_apps: number;
    top_category: string;
    total_screen_time: number;
  };
}

const UsageStats: React.FC<UsageStatsProps> = ({ metadata }) => {
  // Format screen time (minutes) to hours and minutes
  const formatScreenTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 animate-fade-in">
      <Card className="card-shadow hover:shadow-lg transition-shadow">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="bg-mindbridge-blue-light/30 p-3 rounded-full">
            <Clock className="h-6 w-6 text-mindbridge-blue" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Screen Time</p>
            <h3 className="text-2xl font-bold">{formatScreenTime(metadata.total_screen_time)}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow hover:shadow-lg transition-shadow">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Smartphone className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Apps Used</p>
            <h3 className="text-2xl font-bold">{metadata.total_apps}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow hover:shadow-lg transition-shadow">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <BarChartHorizontal className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Top Category</p>
            <h3 className="text-xl font-bold truncate">{metadata.top_category}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageStats;
