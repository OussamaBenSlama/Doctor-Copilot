
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Phone, Mail, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Patient } from '@/types';

interface PatientHeaderProps {
  patient: Patient;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  const getRiskBadge = (risk: Patient['risk']) => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="mb-6 animate-fade-in">
      <Link to="/">
        <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-mindbridge-blue">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 md:h-20 md:w-20">
            <AvatarImage src={patient.avatar} alt={patient.name} />
            <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="ml-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold">{patient.name}</h1>
              {getRiskBadge(patient.risk)}
            </div>
            <div className="flex items-center text-gray-600 mt-1">
              <span>{patient.age} years &bull; {patient.gender}</span>
            </div>
            <p className="text-mindbridge-blue font-medium mt-1">{patient.condition}</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
          </div>
          
          <Button size="sm" className="bg-mindbridge-blue hover:bg-mindbridge-blue-dark">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
          
          <Button size="sm" variant="outline" className="border-mindbridge-blue text-mindbridge-blue hover:bg-mindbridge-blue-light/50">
            <Phone className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
