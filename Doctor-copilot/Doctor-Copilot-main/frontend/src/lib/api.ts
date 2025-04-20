import { ReportData } from "@/types";
import { DashboardData } from "@/types/diagrams";

const API_URL = "http://localhost:5000";

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/get-charts`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
}
export async function fetchFullReport(): Promise<string> {
  const response = await fetch(`${API_URL}/get-report`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const reportData: ReportData = await response.json();
  console.log(reportData.data);
  return reportData.data;
}

export async function fetchReport(): Promise<string> {
  const response = await fetch(`${API_URL}/get-summary`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const reportData: ReportData = await response.json();
  console.log(reportData.data);
  return reportData.data;
}
