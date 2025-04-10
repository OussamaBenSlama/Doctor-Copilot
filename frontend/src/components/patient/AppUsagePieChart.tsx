
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyUsageData } from '@/types';

interface AppUsagePieChartProps {
  data: DailyUsageData[];
  selectedDate?: string;
}

const COLORS = ['#33C3F0', '#6FCF97', '#BB6BD9', '#F2994A', '#EB5757', '#2D9CDB', '#27AE60', '#F2C94C', '#9B51E0'];

const AppUsagePieChart: React.FC<AppUsagePieChartProps> = ({ data, selectedDate }) => {
  const chartData = useMemo(() => {
    // If a date is selected, filter to that day, otherwise use the latest day
    let dayData: DailyUsageData;
    
    if (selectedDate) {
      dayData = data.find(d => d.date === selectedDate) || data[data.length - 1];
    } else {
      dayData = data[data.length - 1]; // Latest day
    }
    
    const displayDate = new Date(dayData.date).toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric'
    });
    
    // Format screen time data for the pie chart
    const appUsage = Object.entries(dayData.screen_time)
      .map(([name, minutes]) => ({
        name,
        minutes,
        value: minutes,
      }))
      .filter(app => app.minutes > 0) // Filter out apps with no usage
      .sort((a, b) => b.minutes - a.minutes); // Sort by usage (descending)
    
    return { displayDate, appUsage };
  }, [data, selectedDate]);
  
  // Calculate total screen time
  const totalScreenTime = chartData.appUsage.reduce((sum, app) => sum + app.minutes, 0);
  const formattedTotal = formatTime(totalScreenTime);
  
  return (
    <Card className="animate-fade-in card-shadow card-gradient">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <span>App Usage Distribution</span>
          <span className="text-sm font-normal text-gray-500">{chartData.displayDate}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500">Total Screen Time</p>
          <p className="text-2xl font-bold">{formattedTotal}</p>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.appUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
              >
                {chartData.appUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} min`, '']} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {chartData.appUsage.slice(0, 4).map((app, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm flex-1 truncate">{app.name}</span>
              <span className="text-sm font-medium">{app.minutes} min</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to format pie chart labels
const renderCustomizedLabel = ({ 
  cx, cy, midAngle, innerRadius, outerRadius, percent 
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

// Helper function to format time
const formatTime = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
};

export default AppUsagePieChart;
