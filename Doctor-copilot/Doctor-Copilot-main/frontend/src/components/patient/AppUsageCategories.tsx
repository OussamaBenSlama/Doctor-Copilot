
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AppCategory {
  name: string;
  value: number;
  color?: string;
}

interface AppUsageCategoriesProps {
  data: AppCategory[];
  title?: string;
}

const COLORS = ['#33C3F0', '#6FCF97', '#BB6BD9', '#F2994A', '#EB5757', '#2D9CDB', '#27AE60', '#F2C94C', '#9B51E0'];

const AppUsageCategories: React.FC<AppUsageCategoriesProps> = ({ 
  data,
  title = "App Usage by Category"
}) => {
  // Calculate total value for percentage calculations
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  
  // Prepare data with colors
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));
  
  // Custom label renderer for the pie chart
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

  return (
    <Card className="animate-fade-in card-shadow card-gradient">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} (${((value/total) * 100).toFixed(1)}%)`, '']} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppUsageCategories;
