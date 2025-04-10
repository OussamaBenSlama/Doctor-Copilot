
import { Patient, PatientAnalytics } from '@/types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    condition: 'Anxiety Disorder',
    lastVisit: '2025-03-28',
    nextAppointment: '2025-04-15',
    risk: 'medium'
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 34,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    condition: 'Depression',
    lastVisit: '2025-04-02',
    nextAppointment: '2025-04-18',
    risk: 'high'
  },
  {
    id: '3',
    name: 'Emily Davis',
    age: 22,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    condition: 'Social Anxiety',
    lastVisit: '2025-03-25',
    nextAppointment: '2025-04-22',
    risk: 'low'
  },
  {
    id: '4',
    name: 'James Wilson',
    age: 41,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/14.jpg',
    condition: 'PTSD',
    lastVisit: '2025-04-05',
    nextAppointment: '2025-04-19',
    risk: 'medium'
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    age: 31,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    condition: 'Bipolar Disorder',
    lastVisit: '2025-04-01',
    nextAppointment: '2025-04-25',
    risk: 'high'
  },
  {
    id: '6',
    name: 'Daniel Thompson',
    age: 26,
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    condition: 'OCD',
    lastVisit: '2025-03-27',
    nextAppointment: null,
    risk: 'low'
  },
  {
    id: '7',
    name: 'Sophia Lee',
    age: 19,
    gender: 'Female',
    avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
    condition: 'Generalized Anxiety',
    lastVisit: '2025-04-07',
    nextAppointment: '2025-04-21',
    risk: 'medium'
  }
];

// Function to generate random screen time (in minutes) for apps
const generateRandomScreenTime = () => {
  const apps = ['Instagram', 'TikTok', 'YouTube', 'Netflix', 'Twitter', 'Facebook', 'Messages', 'Chrome', 'Safari'];
  const result: Record<string, number> = {};
  
  apps.forEach(app => {
    // Generate a random number between 0 and 240 minutes (4 hours)
    result[app] = Math.floor(Math.random() * 240);
  });
  
  return result;
};

// Function to generate random notifications
const generateRandomNotifications = () => {
  const possibleNotifications = [
    "Why am I like this?",
    "Remember to take your medication",
    "Feeling anxious right now",
    "Can't sleep again",
    "Need to talk to someone",
    "Feeling better today",
    "Having dark thoughts",
    "Missed my therapy session",
    "Feeling overwhelmed",
    "Had a panic attack"
  ];
  
  const count = Math.floor(Math.random() * 5) + 1; // 1 to 5 notifications
  const results: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * possibleNotifications.length);
    results.push(possibleNotifications[index]);
  }
  
  return results;
};

// Function to generate random browsing history
const generateRandomBrowsing = () => {
  const possibleSites = [
    "reddit.com/r/anxiety",
    "healthline.com/health/anxiety",
    "psychologytoday.com/therapy",
    "youtube.com/meditation-videos",
    "mayoclinic.org/diseases-conditions/depression",
    "webmd.com/depression/symptoms",
    "nimh.nih.gov/health/topics/depression",
    "twitter.com/search?q=mental%20health",
    "facebook.com/groups/anxietysupport",
    "instagram.com/explore/tags/mentalhealth"
  ];
  
  const count = Math.floor(Math.random() * 6) + 2; // 2 to 7 sites
  const results: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * possibleSites.length);
    results.push(possibleSites[index]);
  }
  
  return results;
};

// Generate mock analytics data for each patient
export const generateMockAnalytics = (patientId: string): PatientAnalytics => {
  const usageData: PatientAnalytics["usageData"] = [];
  
  // Generate data for the last 14 days
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    usageData.push({
      date: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
      screen_time: generateRandomScreenTime(),
      notifications: generateRandomNotifications(),
      browsing: generateRandomBrowsing()
    });
  }
  
  return {
    patientId,
    usageData
  };
};

export const getPatientAnalytics = (patientId: string): PatientAnalytics => {
  return generateMockAnalytics(patientId);
};

export const getPatientById = (id: string): Patient | undefined => {
  return mockPatients.find(patient => patient.id === id);
};

export const getAllPatients = (): Patient[] => {
  return mockPatients;
};
