
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Patient } from '@/types';

interface PatientListProps {
  patients: Patient[];
}

const PatientList: React.FC<PatientListProps> = ({ patients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskBadge = (risk: Patient['risk']) => {
    switch (risk) {
      case 'high':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            High Risk
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Medium Risk
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Low Risk
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="p-4 md:p-6 animate-fade-in card-shadow card-gradient">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Patients</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search patients by name or condition..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No patients found</p>
          </div>
        ) : (
          filteredPatients.map(patient => (
            <Link to={`/patient/${patient.id}`} key={patient.id}>
              <div className="flex items-center p-4 rounded-lg hover:bg-mindbridge-blue-light/30 transition-colors">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={patient.avatar} alt={patient.name} />
                  <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{patient.condition}</p>
                    </div>
                    {getRiskBadge(patient.risk)}
                  </div>
                </div>
                
                <div className="ml-2 text-right">
                  {patient.nextAppointment ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{new Date(patient.nextAppointment).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100">No Upcoming</Badge>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
};

export default PatientList;
