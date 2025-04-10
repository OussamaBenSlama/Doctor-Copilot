
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PatientHeader from '@/components/patient/PatientHeader';
import AppUsageCategories from '@/components/patient/AppUsageCategories';
import TimeOfDayUsage from '@/components/patient/TimeOfDayUsage';
import WebsiteUsage from '@/components/patient/WebsiteUsage';
import UsageStats from '@/components/patient/UsageStats';
import GenerateReportButton from '@/components/patient/GenerateReportButton';
import { Card, CardContent } from '@/components/ui/card';
import { getPatientById, getPatientAnalytics } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileBarChart, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchDashboardData } from '@/lib/api';
import { DashboardData } from '@/types/diagrams';

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isGeneratingPartial, setIsGeneratingPartial] = useState(false);
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [realData, setData] = useState<DashboardData>();
  
  const patient = getPatientById(id || '');
  const analytics = getPatientAnalytics(id || '');
  
  // Data fetching
  useEffect(() => {
    fetchDashboardData()
    .then((data)=> setData(data))
  }, [])
  

  // const realData = {
  //   app_usage_data: data.app_usage_data,
  //   website_visits: data.website_visits,
  //   website_categories: data.website_categories,
  //   usage_by_timeframe: data.usage_by_timeframe
  // }
  // Sample data for the new visualizations
  const sampleData = {
    app_usage_data: [
      { name: "Social Media", value: 124, category: "Entertainment" },
      { name: "Games", value: 85, category: "Entertainment" },
      { name: "Health & Fitness", value: 42, category: "Health" },
      { name: "Productivity", value: 38, category: "Work" },
      { name: "News", value: 22, category: "Information" }
    ],
    website_visits: [
      { name: "facebook.com", value: 35 },
      { name: "youtube.com", value: 28 },
      { name: "twitter.com", value: 24 },
      { name: "instagram.com", value: 22 },
      { name: "reddit.com", value: 18 },
      { name: "linkedin.com", value: 12 },
      { name: "pinterest.com", value: 8 },
      { name: "amazon.com", value: 7 }
    ],
    website_categories: [
      { name: "Social Media", value: 105 },
      { name: "Entertainment", value: 65 },
      { name: "News", value: 38 },
      { name: "Shopping", value: 22 },
      { name: "Education", value: 18 }
    ],
    usage_by_timeframe: [
      { timeframe: "Morning", value: 85 },
      { timeframe: "Afternoon", value: 125 },
      { timeframe: "Evening", value: 165 },
      { timeframe: "Night", value: 75 }
    ],
    metadata: {
      total_apps: 18,
      top_category: "Social Media",
      total_screen_time: 450,
    }
  };
  
  if (!patient) {
    setTimeout(() => {
      toast({
        title: "Patient Not Found",
        description: "The requested patient profile could not be found.",
        variant: "destructive",
      });
    }, 0);
    
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold text-gray-700">Patient not found</h1>
          <p className="text-gray-500">The requested patient profile does not exist.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleGenerateFullReport = () => {
    setIsGeneratingFull(true);
    setIsLoadingReport(true);
    setReportContent(null);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingFull(false);
      setIsLoadingReport(false);
      setReportContent("Patient digital behavior analysis indicates increased usage of social media applications during evening hours. Recommendation: Implement screen time limits between 8pm-11pm to improve sleep hygiene and reduce digital dependency patterns. Monitor changes in usage patterns over the next 14 days.");
      
      toast({
        title: "Report Generated Successfully",
        description: `Digital behavior report for ${patient.name} is ready to view.`,
        variant: "default",
      });
    }, 3000);
  };

  const handleGeneratePartialReport = () => {
    setIsGeneratingPartial(true);
    setIsLoadingReport(true);
    setReportContent(null);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingPartial(false);
      setIsLoadingReport(false);
      setReportContent("Partial analysis shows concerning patterns in late night digital activity. Patient exhibits 73% higher engagement with social media platforms compared to peer group. Consider discussing potential impacts on sleep quality and emotional well-being during next session.");
      
      toast({
        title: "Partial Report Generated",
        description: `Partial digital behavior report for ${patient.name} is ready to view.`,
        variant: "default",
      });
    }, 3000);
  };
  
  return (
    <DashboardLayout>
      <PatientHeader patient={patient} />
      
      {/* Report Generation Buttons */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-shadow">
          <CardContent className="p-6">
            <Button 
              className="w-full bg-mindbridge-blue hover:bg-mindbridge-blue-dark"
              onClick={handleGenerateFullReport}
              disabled={isGeneratingFull || isGeneratingPartial}
            >
              {isGeneratingFull ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileBarChart className="mr-2 h-4 w-4" />
                  Generate Digital Behavior Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardContent className="p-6">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleGeneratePartialReport}
              disabled={isGeneratingPartial || isGeneratingFull}
            >
              {isGeneratingPartial ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Partial Report...
                </>
              ) : (
                <>
                  <FileBarChart className="mr-2 h-4 w-4" />
                  Generate Partial Digital Behavior Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Report Display Section */}
      {(isLoadingReport || reportContent) && (
        <Card className="mb-8 animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Analysis Report</h3>
            {isLoadingReport ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[85%]" />
              </div>
            ) : (
              <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                <p className="text-gray-700 dark:text-gray-300">{reportContent}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Digital Behavior Analytics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Digital Behavior Analytics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AppUsageCategories data={realData?.app_usage_data || sampleData.app_usage_data} />
          <TimeOfDayUsage data={realData?.usage_by_timeframe || sampleData.usage_by_timeframe} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WebsiteUsage 
            data={realData?.website_visits || sampleData.website_visits} 
            title="Top Website Visits"
          />
          <AppUsageCategories 
            data={realData?.website_categories || sampleData.website_categories} 
            title="Website Categories"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
