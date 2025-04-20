
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertCircle, Info } from 'lucide-react';
import { DailyUsageData } from '@/types';

interface NotificationsHistoryProps {
  data: DailyUsageData[];
}

const NotificationsHistory: React.FC<NotificationsHistoryProps> = ({ data }) => {
  // Get the last 10 days of notifications
  const recentNotifications = React.useMemo(() => {
    return data
      .slice(-7) // Get the last 7 days
      .flatMap(day => {
        return day.notifications.map(notification => ({
          date: day.date,
          text: notification,
        }));
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending
  }, [data]);
  
  return (
    <Card className="animate-fade-in card-shadow card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          <span>Recent Notifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-gray-500">
            <Info className="h-8 w-8 mb-2" />
            <p>No notifications found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentNotifications.map((notification, index) => (
              <div key={index} className="flex items-start p-3 rounded-md bg-white/50 border border-gray-100">
                <div className="bg-mindbridge-blue-light p-2 rounded-full">
                  <Bell className="h-4 w-4 text-mindbridge-blue-dark" />
                </div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">{notification.text}</p>
                    {notification.text.toLowerCase().includes('panic') || 
                     notification.text.toLowerCase().includes('anxious') || 
                     notification.text.toLowerCase().includes('dark thoughts') ? (
                      <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Concern
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-gray-500">{new Date(notification.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsHistory;
