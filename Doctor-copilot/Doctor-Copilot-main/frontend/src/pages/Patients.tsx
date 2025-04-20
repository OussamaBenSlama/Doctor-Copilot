
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PatientList from '@/components/dashboard/PatientList';
import { getAllPatients } from '@/services/mockData';

const Patients = () => {
  const patients = getAllPatients();
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Patients</h1>
        <p className="text-gray-600">Manage and monitor your patients</p>
      </div>
      
      <PatientList patients={patients} />
    </DashboardLayout>
  );
};

export default Patients;
