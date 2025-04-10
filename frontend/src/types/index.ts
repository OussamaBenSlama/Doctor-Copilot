
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  condition: string;
  lastVisit: string;
  nextAppointment: string | null;
  risk: 'low' | 'medium' | 'high';
}

export interface DailyUsageData {
  date: string;
  screen_time: Record<string, number>;
  notifications: string[];
  browsing: string[];
}

export interface PatientAnalytics {
  patientId: string;
  usageData: DailyUsageData[];
}
