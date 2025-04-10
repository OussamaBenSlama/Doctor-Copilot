
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, ExternalLink } from 'lucide-react';
import { DailyUsageData } from '@/types';

interface BrowsingHistoryProps {
  data: DailyUsageData[];
}

const BrowsingHistory: React.FC<BrowsingHistoryProps> = ({ data }) => {
  // Get unique browsing entries from the last 7 days
  const recentBrowsing = React.useMemo(() => {
    const browsingEntries = data
      .slice(-7) // Get the last 7 days
      .flatMap(day => {
        return day.browsing.map(site => ({
          date: day.date,
          site,
        }));
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending
    
    // Group by site
    const siteMap = new Map();
    browsingEntries.forEach(entry => {
      if (!siteMap.has(entry.site)) {
        siteMap.set(entry.site, entry);
      }
    });
    
    return Array.from(siteMap.values());
  }, [data]);
  
  // Function to get a friendly name for the site
  const getSiteName = (url: string): string => {
    try {
      // Extract domain
      const domain = url.replace(/(https?:\/\/)?(www\.)?/, '').split('/')[0];
      
      // For reddit, get the subreddit name
      if (url.includes('reddit.com/r/')) {
        const subreddit = url.match(/reddit\.com\/r\/([^\/]+)/);
        if (subreddit && subreddit[1]) {
          return `r/${subreddit[1]}`;
        }
      }
      
      // For specific domains, make them prettier
      if (domain === 'psychologytoday.com') return 'Psychology Today';
      if (domain === 'mayoclinic.org') return 'Mayo Clinic';
      if (domain === 'healthline.com') return 'Healthline';
      if (domain === 'nimh.nih.gov') return 'NIMH';
      if (domain === 'webmd.com') return 'WebMD';
      
      return domain;
    } catch (e) {
      return url;
    }
  };
  
  // Get site category
  const getSiteCategory = (url: string): string => {
    if (url.includes('reddit.com')) return 'Social Media';
    if (url.includes('youtube.com')) return 'Video';
    if (url.includes('twitter.com') || url.includes('facebook.com') || url.includes('instagram.com')) {
      return 'Social Media';
    }
    if (url.includes('psychologytoday.com') || url.includes('mayoclinic.org') || 
        url.includes('healthline.com') || url.includes('nimh.nih.gov') || 
        url.includes('webmd.com')) {
      return 'Health';
    }
    return 'Other';
  };
  
  // Get category badge color
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Social Media':
        return 'bg-blue-100 text-blue-800';
      case 'Health':
        return 'bg-green-100 text-green-800';
      case 'Video':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="animate-fade-in card-shadow card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          <span>Browsing History Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentBrowsing.map((entry, index) => {
            const siteName = getSiteName(entry.site);
            const category = getSiteCategory(entry.site);
            const categoryColor = getCategoryColor(category);
            
            return (
              <div key={index} className="flex items-start p-3 rounded-md bg-white/50 border border-gray-100">
                <div className="bg-mindbridge-blue-light p-2 rounded-full">
                  <Globe className="h-4 w-4 text-mindbridge-blue-dark" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium">{siteName}</p>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${categoryColor}`}>
                          {category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{entry.site}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className="ml-2 text-gray-400 hover:text-mindbridge-blue-dark">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrowsingHistory;
