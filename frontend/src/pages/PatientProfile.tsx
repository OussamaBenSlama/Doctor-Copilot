import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PatientHeader from "@/components/patient/PatientHeader";
import AppUsageCategories from "@/components/patient/AppUsageCategories";
import TimeOfDayUsage from "@/components/patient/TimeOfDayUsage";
import WebsiteUsage from "@/components/patient/WebsiteUsage";
import UsageStats from "@/components/patient/UsageStats";
import GenerateReportButton from "@/components/patient/GenerateReportButton";
import { Card, CardContent } from "@/components/ui/card";
import { getPatientById, getPatientAnalytics } from "@/services/mockData";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileBarChart, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboardData, fetchFullReport, fetchReport } from "@/lib/api";
import { DashboardData } from "@/types/diagrams";
import { marked } from 'marked';
import Loader from "@/components/layout/Loader";

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isGeneratingPartial, setIsGeneratingPartial] = useState(false);
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [realData, setData] = useState<DashboardData>();
  const [report, setReport] = useState<DashboardData>();
  const [summary, setSummary] = useState<DashboardData>();

  const patient = getPatientById(id || "");
  const analytics = getPatientAnalytics(id || "");

  // Data fetching
  useEffect(() => {
    fetchDashboardData().then((data) => setData(data));
  }, []);


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
          <h1 className="text-2xl font-bold text-gray-700">
            Patient not found
          </h1>
          <p className="text-gray-500">
            The requested patient profile does not exist.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const handleGenerateFullReport = () => {
    setIsGeneratingFull(true);
    setIsLoadingReport(true);
    setReportContent(null);

    fetchFullReport()
      .then(async (data) => {
        setIsGeneratingFull(false);
  setIsLoadingReport(false);
  const htmlContent = await marked(data);
  setReportContent(htmlContent); // set directly
  toast({
    title: "Report Generated Successfully",
    description: `Digital behavior report for ${patient.name} is ready to view.`,
    variant: "default",
  });
      })
      .catch((error) => {
        setReportContent(
          "Patient digital behavior analysis indicates increased usage of social media applications during evening hours. Recommendation: Implement screen time limits between 8pm-11pm to improve sleep hygiene and reduce digital dependency patterns. Monitor changes in usage patterns over the next 14 days."
        );
        toast({
          title: "Error",
          description: "Failed to generate report.",
          variant: "destructive",
        });
      });
  };

  const handleGeneratePartialReport = () => {
    setIsGeneratingFull(true);
    setIsLoadingReport(true);
    setReportContent(null);

    fetchReport()
      .then(async (data) => {
        setIsGeneratingFull(false);
  setIsLoadingReport(false);
  const htmlContent = await marked(data);
  setReportContent(htmlContent); // set directly
  toast({
    title: "Report Generated Successfully",
    description: `Digital behavior report for ${patient.name} is ready to view.`,
    variant: "default",
  });
      })
      .catch((error) => {
        setReportContent(
          "Patient digital behavior analysis indicates increased usage of social media applications during evening hours. Recommendation: Implement screen time limits between 8pm-11pm to improve sleep hygiene and reduce digital dependency patterns. Monitor changes in usage patterns over the next 14 days."
        );
        toast({
          title: "Error",
          description: "Failed to generate report.",
          variant: "destructive",
        });
      });
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
                  Generate Report
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
                  Key Insights
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
                <div className="text-gray-700 dark:text-gray-300" id="content">
                <div dangerouslySetInnerHTML={{ __html: reportContent || "" }} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Digital Behavior Analytics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Digital Behavior Analytics
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {realData?.app_usage_data ? (
            <AppUsageCategories
            data={realData?.app_usage_data}
          />
          ) : (
            <Loader/>
          )}
          {realData?.usage_by_timeframe ? (
            <TimeOfDayUsage
            data={realData?.usage_by_timeframe}
          />
          ) : (
            <Loader/>
          )}
          
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {realData?.website_visits ? (
            <WebsiteUsage
            data={realData?.website_visits}
            title="Top Website Visits"
          />
          ) : (
            <Loader/>
          )}
          {realData?.website_categories ? (
            <AppUsageCategories
            data={realData?.website_categories}
            title="Website Categories"
          />
          ) : (
            <Loader/>
          )}
          
          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
