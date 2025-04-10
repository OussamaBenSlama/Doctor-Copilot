import { DashboardData } from '@/types/diagrams';

const API_URL = 'http://localhost:5000';

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/api/dashboard-data`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
}