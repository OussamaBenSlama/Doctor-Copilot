
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, AlertTriangle, Brain } from 'lucide-react';
import { Patient } from '@/types';

interface StatsOverviewProps {
  patients: Patient[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ patients }) => {
  // Calculate stats
  const totalPatients = patients.length;
  const upcomingAppointments = patients.filter(p => p.nextAppointment).length;
  const highRiskPatients = patients.filter(p => p.risk === 'high').length;
  
  const statItems = [
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Users,
      color: 'bg-mindbridge-blue-light text-mindbridge-blue-dark',
    },
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments,
      icon: Calendar,
      color: 'bg-mindbridge-green-light text-mindbridge-green-dark',
    },
    {
      title: 'High Risk Patients',
      value: highRiskPatients,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Mental Health Platform',
      value: 'MindBridge',
      icon: Brain,
      color: 'bg-mindbridge-purple-light text-mindbridge-purple-dark',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in mb-6">
      {statItems.map((item, index) => (
        <Card key={index} className="card-shadow hover:translate-y-[-4px] transition-transform duration-300">
          <CardContent className="p-4 flex items-center">
            <div className={`p-3 rounded-full ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{item.title}</p>
              <h3 className="text-2xl font-semibold">{item.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
