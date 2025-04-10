
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimeframeData {
  timeframe: string;
  value: number;
  color?: string;
}

interface TimeOfDayUsageProps {
  data: TimeframeData[];
}

const COLORS = {
  Morning: '#F2C94C', // Yellow for morning
  Afternoon: '#F2994A', // Orange for afternoon
  Evening: '#9B51E0', // Purple for evening
  Night: '#2D9CDB'    // Blue for night
};

const TimeOfDayUsage: React.FC<TimeOfDayUsageProps> = ({ data }) => {
  // Add colors to the data
  const chartData = data.map(item => ({
    ...item,
    color: COLORS[item.timeframe as keyof typeof COLORS] || '#33C3F0'
  }));

  // Format time value for tooltip
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card className="animate-fade-in card-shadow card-gradient">
      <CardHeader>
        <CardTitle>Usage by Time of Day</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="timeframe" />
              <YAxis
                tickFormatter={(value) => `${Math.floor(value / 60)}h`}
                label={{ value: 'Screen Time', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => [formatTime(value as number), 'Screen Time']} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeOfDayUsage;
