
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GenerateReportButtonProps {
  patientId: string;
  patientName: string;
}

const GenerateReportButton: React.FC<GenerateReportButtonProps> = ({ patientId, patientName }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      
      toast({
        title: "Report Generated Successfully",
        description: `Digital behavior report for ${patientName} is ready to download.`,
        variant: "default",
      });
      
      // Reset state after 3 seconds
      setTimeout(() => {
        setIsGenerated(false);
      }, 3000);
    }, 2000);
  };
  
  return (
    <Button 
      className="w-full bg-mindbridge-blue hover:bg-mindbridge-blue-dark"
      onClick={handleGenerateReport}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Report...
        </>
      ) : isGenerated ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Report Generated
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Generate Digital Behavior Report
        </>
      )}
    </Button>
  );
};

export default GenerateReportButton;
