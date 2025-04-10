
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WebsiteData {
  name: string;
  value: number;
}

interface WebsiteUsageProps {
  data: WebsiteData[];
  title?: string;
}

const WebsiteUsage: React.FC<WebsiteUsageProps> = ({ 
  data,
  title = "Top Website Visits"
}) => {
  // Sort data by value in descending order and take top 7
  const sortedData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, 7)
    .map(item => ({
      ...item,
      // Truncate long domain names
      displayName: item.name.length > 20 ? item.name.substring(0, 17) + '...' : item.name
    }));

  return (
    <Card className="animate-fade-in card-shadow card-gradient">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={sortedData}
              margin={{
                top: 5,
                right: 30,
                left: 70,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="displayName" 
                width={65} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`${value} visits`, '']}
                labelFormatter={(name) => {
                  const item = data.find(d => d.name.startsWith(name.toString().replace('...', '')));
                  return item ? item.name : name;
                }}
              />
              <Bar dataKey="value" fill="#33C3F0" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteUsage;
