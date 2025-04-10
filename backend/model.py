# %%
from crewai import Agent, LLM ,Task 
import os
from dotenv import load_dotenv

load_dotenv()


# %%
my_llm = LLM(
    model='gemini/gemini-1.5-flash',
    api_key=os.getenv('GOOGLE_API_KEY')
)

print(os.getenv('GOOGLE_API_KEY'))

# %%
data_loader_agent = Agent(
    name="Data Loader",
    role="JSON Data Behavior Analyzer",
    llm=my_llm,
    goal='Extract, validate, and summarize user behavior patterns from JSON data',
    backstory="""You are a specialized backend AI assistant responsible for processing and analyzing user-generated behavioral data from JSON files.
    Your expertise lies in extracting meaningful patterns, ensuring data quality, and transforming raw logs into structured insights about digital behavior.""",
    instructions=[
        "Extract key behavioral metrics including most frequently used applications, total screen time per app, most visited websites, and common search keywords",
        "Identify and categorize sentiment-related keywords that may indicate user emotional states",
        "Validate data structure and handle missing or malformed fields gracefully",
        "Normalize time measurements to a consistent format (minutes/hours)",
        "Return a well-structured JSON response with categorized behavioral insights",
        "Include summary statistics for each behavioral category"
    ],
    markdown=True,
    verbose=True,
)

data_loading_task = Task(
    description="""Process the provided JSON data containing screen_time, notifications, and browsing history information.
    Extract and summarize the following behavioral patterns:
    1. App usage statistics (most used apps, time spent per app)
    2. Website browsing patterns (most visited domains, frequency)
    3. Search/content keywords (most common terms, categories)
    4. Sentiment indicators (emotion-related keywords in search/content)
    5. Daily/weekly usage patterns if timestamps are available
    
    Validate data integrity and provide a structured analysis in JSON format.
    """,
    agent=data_loader_agent,
    expected_output="""A comprehensive JSON object containing:
    {
        "app_usage": {
            "most_used_apps": [{"app_name": string, "frequency": number, "total_time": number}],
            "total_screen_time": number,
            "usage_summary": string
        },
        "web_activity": {
            "most_visited_sites": [{"domain": string, "visit_count": number}],
            "browsing_patterns": string
        },
        "content_analysis": {
            "common_keywords": [{"term": string, "frequency": number, "category": string}],
            "sentiment_indicators": [{"term": string, "sentiment": string, "frequency": number}]
        }
    }""",
)

# %%
behavior_analyzer_agent = Agent(
    name="Behavior Analyzer",
    llm=my_llm,
    role='Digital Behavior Psychologist',
    goal='Analyze digital behavior patterns to identify potential mental health indicators and wellbeing insights',
    backstory="""
    You are an advanced behavioral analysis AI specializing in digital psychology. With expertise in
    interpreting app usage patterns, content preferences, and engagement habits, you identify 
    behavioral trends that may indicate changes in mental wellbeing. Your analysis is balanced,
    evidence-based, and focused on providing actionable insights rather than clinical diagnoses.
    Your approach is empathetic but objective, prioritizing patterns over isolated data points.
    """,
    instructions=[
        "Analyze app usage patterns for signs of social withdrawal, sleep disruption, or compulsive behaviors",
        "Examine content themes and search patterns for emotional indicators (anxiety, depression, stress)",
        "Identify changes in communication frequency and social app engagement",
        "Look for behavioral markers like late-night usage spikes, reduced productivity app usage, or increased escapism behaviors",
        "Analyze time distribution across different app categories (social, entertainment, productivity, health)",
        "Search for keywords that indicate emotional states in browsing history and search terms",
        "Categorize behaviors as either potential concerns or positive indicators",
        "Use evidence-based behavioral science to support observations",
        "Never diagnose specific conditions - focus on behavioral patterns only",
        "Maintain a balanced perspective that acknowledges both concerning and positive indicators",
        "Provide actionable insights based on identified patterns"
    ],
    verbose=True,
    allow_delegation=False
)

behavior_analyzing_task = Task(
    description="""
    Analyze the provided digital behavior data to identify patterns that may indicate mental wellbeing status.
    
    Focus on:
    1. Screen time patterns (excessive use, night usage, app category balance)
    2. Content consumption themes (emotional keywords, interests, information-seeking behaviors)
    3. Social engagement indicators (communication apps usage, interaction patterns)
    4. Productivity vs. entertainment balance
    5. Behavioral consistency and significant changes
    
    Using these patterns, create a comprehensive behavioral insight report that highlights both potential concerns and positive indicators.
    """,
    expected_output="""
    A structured report detailing:
    - Significant behavioral patterns observed across digital activities
    - Potential mental health indicators (both concerning and positive signals)
    - Prioritized list of behavioral patterns that may impact wellbeing
    - Evidence-based connections between observed patterns and mental health/wellbeing
    """,
    agent=behavior_analyzer_agent,
    context_from=[data_loading_task]  
)

# %%
clinical_insight_agent = Agent(
    name='Clinical Guidance Specialist',
    role='Mental Health Professional Assistant',
    llm=my_llm,
    goal='Translate behavioral data analysis into clinically relevant insights and conversation guidance',
    backstory="""
    You are a specialized assistant for mental health professionals, trained to bridge the gap between digital 
    behavioral data and clinical practice. Your expertise lies in transforming behavioral analysis into 
    actionable clinical discussion points, while maintaining appropriate boundaries of your role. You help 
    clinicians identify relevant patterns that deserve exploration in therapeutic settings, formulate 
    effective questions, and connect digital behaviors to established clinical frameworks. Your guidance 
    is evidence-informed, balanced, and always acknowledges the limitations of behavioral data analysis.
    """,
    instructions=[
        "Identify potential clinical concerns without making definitive diagnoses",
        "Translate behavioral patterns into clinically relevant discussion points",
        "Formulate open-ended questions that explore identified patterns sensitively",
        "Prioritize issues by apparent severity and clinical relevance",
        "Distinguish between clear warning signs and subtle patterns requiring exploration",
        "Include positive coping mechanisms and strengths identified in the data",
        "Structure outputs in a clinical and a short format that's easy to reference during sessions",
        "Use precise clinical language while avoiding jargon that patients wouldn't understand",
        "Always acknowledge the primacy of in-person clinical judgment over data analysis"
    ],
    verbose=True,
    allow_delegation=False
)

clinical_guidance_task = Task(
    description="""
    Based on the provided behavioral analysis report, develop a short clinical guidance 
    document that would assist a mental health doctor in their next session.
    
    Your response should:
    1. Identify behavioral patterns that may indicate specific mental health concerns
    2. Prioritize issues by clinical significance
    3. Formulate targeted, open-ended questions to explore these patterns sensitively
    4. Connect observed digital behaviors to potential underlying psychological processes
    5. Highlight both concerning patterns and potential protective factors/strengths    """,
    expected_output="""
    A short  markdown document containing the following:
    ## Priority Areas for Exploration
    - Prioritized list of behavioral patterns related to mental health concerns
    ## Suggested Assessment Focus
    - Specific areas that warrant formal clinical assessment
    ## Therapeutic Conversation Starters
    - Open-ended questions organized by topic area
    ## Potential Strengths & Protective Factors
    - Positive patterns identified in the behavioral data
    """,
    agent=clinical_insight_agent,
    context_from=[behavior_analyzing_task]  
)

# %%
app_usage_chart_agent = Agent(
    name="Data Visualization Specialist",
    role="Data Visualization & Analytics Expert",
    goal="Transform behavioral data into insightful visual representations for mental health analysis",
    llm=my_llm,
    backstory="""
    You are a specialized data visualization expert with extensive experience in transforming complex 
    digital behavior data into clear, meaningful visual insights. Your expertise lies in distilling 
    patterns from screen time, app usage, and browsing history to create visualizations that highlight 
    behavioral trends relevant to mental health professionals. You excel at selecting the most appropriate 
    chart types, color schemes, and data representations to make insights immediately apparent.
    """,
    instructions=[
        "Extract and normalize relevant metrics from behavioral data",
        "Transform raw data into visualization-ready formats optimized for Recharts",
        "Categorize digital activities into meaningful groups (productivity, entertainment, social, information-seeking, etc.)",
        "Create clean, properly formatted JSON that can be directly used in visualization components",
        "Apply domain-specific knowledge to highlight patterns relevant to mental health analysis",
        "Include appropriate data aggregation to show trends while preserving privacy",
        "Optimize output for specific chart types (bar charts, pie charts, line charts) based on data characteristics",
        "Ensure data is properly sorted, filtered, and formatted for immediate visualization",
        "Include basic metadata to assist with chart rendering and interpretation",
        "Normalize time measurements to consistent units (minutes, hours) based on magnitude",
        "Choose only the first 4 items for each data field",
    ],
    verbose=True,
    allow_delegation=False,
)

app_usage_chart_task = Task(
    description="""
    Transform the provided digital behavior data into visualization-ready JSON for creating insightful charts.
    
    Generate the following data structures:
    
    1. App Usage Summary:
       - Transform app usage data into a format suitable for bar/pie charts
       - Aggregate total time spent on each application
       - Sort by usage time in descending order
       - Include app category information if available
    
    2. Website Analysis:
       - Extract and count domain names from browsing URLs
       - Create a sorted list of most visited websites
       - Include visit count and time spent metrics
    
    3. Website Category Distribution:
       - Categorize websites into the following groups:
         - Mental Health & Wellbeing: sites related to mental health resources, therapy, meditation, mindfulness
         - Social Media: social networking platforms and community forums
         - Entertainment: streaming, gaming, music, videos
         - News & Information: news sites, reference materials, educational content
         - Productivity: work-related sites, tools, professional content
         - Other: uncategorized sites
       - Create a distribution summary suitable for pie/bar charts
    
    4. Time Pattern Analysis:
       - If timestamp data is available, create time-of-day usage patterns
       - Aggregate usage by morning, afternoon, evening, and night
    5- Choose only the first 4 items for each data field
    6- for mental health related websites focus on the focus if it is related to issues or well-being
    Your output must be valid, properly structured JSON that can be directly used with Recharts components.
    Include appropriate keys and data structures for each chart type.
    """,
    expected_output="""
    A valid JSON object with the following structure:
    {
      "app_usage_data": [
        {"name": "App Name", "value": number, "category": "Category"}
      ],
      "website_visits": [
        {"name": "domain.com", "value": number}
      ],
      "website_categories": [
        {"name": "Category Name", "value": number}
      ],
      "usage_by_timeframe": [
        {"timeframe": "Morning/Afternoon/Evening/Night", "value": number}
      ],
      "metadata": {
        "total_apps": number,
        "top_category": "Category Name",
        "total_screen_time": number
      }
    }
    """,
    agent=app_usage_chart_agent,
    context_from=[data_loading_task] 
)

# %%
import json
import os


def generate_summary(json_data):
    
    analysis_result = data_loader_agent.execute_task(
        task=data_loading_task,  
        context={"user_data": json_data}
    )
    behavior_result = behavior_analyzer_agent.execute_task(
        task=behavior_analyzing_task,
        context={"processed_data": analysis_result}
        )
    clinical_insight_result = clinical_insight_agent.execute_task(
        task=clinical_guidance_task,
        context={"processed_data": behavior_result}
        )
    return clinical_insight_result

def generate_full_report(json_data):
    
    analysis_result = data_loader_agent.execute_task(
        task=data_loading_task,  
        context={"user_data": json_data}
    )
    behavior_result = behavior_analyzer_agent.execute_task(
        task=behavior_analyzing_task,
        context={"processed_data": analysis_result}
        )
    return behavior_result


# %%
import json
import os


def generate_charts_data(json_data):
    
    analysis_result = data_loader_agent.execute_task(
        task=data_loading_task,  
        context={"user_data": json_data}
    )
    data = app_usage_chart_agent.execute_task(
        task = app_usage_chart_task,
        context={"data": analysis_result}
    )
    return data




