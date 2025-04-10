
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsOverview from '@/components/dashboard/StatsOverview';
import { getAllPatients } from '@/services/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Activity, TrendingUp, Brain, BarChart4, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const patients = getAllPatients();
  
  // Get count of patients by risk level
  const patientStats = {
    total: patients.length,
    highRisk: patients.filter(p => p.risk === 'high').length,
    mediumRisk: patients.filter(p => p.risk === 'medium').length,
    lowRisk: patients.filter(p => p.risk === 'low').length,
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Dr. Wilson</p>
      </div>
      
      <StatsOverview patients={patients} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="hover:shadow-lg transition-shadow animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-500" />
              <span>Mental Health Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Recent trends show increased digital activity among patients with anxiety disorders.</p>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>65% correlation</span>
              <span>Last updated: Today</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Insights</Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart4 className="h-5 w-5 mr-2 text-mindbridge-blue" />
              <span>Digital Behavior Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Screen time has increased by 22% across all patient demographics in the last month.</p>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <div className="bg-mindbridge-blue h-16 rounded-t-md" style={{ height: '35px' }}></div>
                <div>Week 1</div>
              </div>
              <div>
                <div className="bg-mindbridge-blue h-16 rounded-t-md" style={{ height: '45px' }}></div>
                <div>Week 2</div>
              </div>
              <div>
                <div className="bg-mindbridge-blue h-16 rounded-t-md" style={{ height: '55px' }}></div>
                <div>Week 3</div>
              </div>
              <div>
                <div className="bg-mindbridge-blue h-16 rounded-t-md" style={{ height: '65px' }}></div>
                <div>Week 4</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Full Report</Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow animate-fade-in">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-auto flex flex-col items-center justify-center py-4 bg-mindbridge-blue hover:bg-mindbridge-blue-dark">
              <Users className="h-6 w-6 mb-2" />
              <span>View Patients</span>
            </Button>
            <Button className="h-auto flex flex-col items-center justify-center py-4 bg-purple-600 hover:bg-purple-700">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Schedule</span>
            </Button>
            <Button className="h-auto flex flex-col items-center justify-center py-4 bg-green-600 hover:bg-green-700">
              <BarChart4 className="h-6 w-6 mb-2" />
              <span>Reports</span>
            </Button>
            <Button className="h-auto flex flex-col items-center justify-center py-4 bg-amber-500 hover:bg-amber-600">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Insights</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Index;
