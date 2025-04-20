
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyUsageData } from '@/types';

interface ScreenTimeChartProps {
  data: DailyUsageData[];
}

interface FormattedData {
  date: string;
  totalMinutes: number;
  [key: string]: number | string;
}

const ScreenTimeChart: React.FC<ScreenTimeChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const topApps = getTopApps(data);
    
    return data.map(day => {
      const formattedDate = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const formattedDay: FormattedData = { 
        date: formattedDate,
        totalMinutes: 0,
      };
      
      // Add screen time for each top app
      topApps.forEach(app => {
        formattedDay[app] = day.screen_time[app] || 0;
        formattedDay.totalMinutes += (day.screen_time[app] || 0);
      });
      
      return formattedDay;
    });
  }, [data]);
  
  const topApps = useMemo(() => getTopApps(data), [data]);
  
  // Define a color palette for the apps
  const colorPalette = [
    '#33C3F0', // mindbridge-blue
    '#6FCF97', // mindbridge-green
    '#BB6BD9', // mindbridge-purple
    '#F2994A', // orange
    '#EB5757', // red
    '#9B51E0', // purple
    '#2D9CDB', // blue
    '#27AE60', // green
    '#F2C94C', // yellow
  ];
  
  return (
    <Card className="animate-fade-in card-shadow card-gradient">
      <CardHeader>
        <CardTitle>Screen Time Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {topApps.map((app, index) => (
                  <linearGradient key={app} id={`color${app}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorPalette[index % colorPalette.length]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colorPalette[index % colorPalette.length]} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis 
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                allowDecimals={false}
              />
              <Tooltip formatter={(value) => [`${value} min`, '']} />
              <Legend />
              {topApps.map((app, index) => (
                <Area
                  key={app}
                  type="monotone"
                  dataKey={app}
                  name={app}
                  stackId="1"
                  stroke={colorPalette[index % colorPalette.length]}
                  fillOpacity={1}
                  fill={`url(#color${app})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get the top 5 apps by total screen time
function getTopApps(data: DailyUsageData[]): string[] {
  // Count total screen time for each app
  const appTotals: Record<string, number> = {};
  
  data.forEach(day => {
    Object.entries(day.screen_time).forEach(([app, minutes]) => {
      appTotals[app] = (appTotals[app] || 0) + minutes;
    });
  });
  
  // Sort apps by total screen time
  return Object.entries(appTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([app]) => app);
}

export default ScreenTimeChart;
