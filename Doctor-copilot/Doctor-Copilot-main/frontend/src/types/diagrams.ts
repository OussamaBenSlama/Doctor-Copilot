export interface AppUsage {
    name: string;
    value: number;
    category: string;
  }
  
  export interface WebsiteVisit {
    name: string;
    value: number;
  }
  
  export interface DashboardData {
    app_usage_data: AppUsage[];
    website_visits: WebsiteVisit[];
    website_categories: WebsiteVisit[];
    usage_by_timeframe: { timeframe: string; value: number }[];
  }