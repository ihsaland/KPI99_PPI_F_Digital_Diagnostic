# How to Use the KPI99 PPI-F Digital Diagnostic Tool

This guide will walk you through using the application to assess your organization's engineering maturity.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Your First Assessment](#creating-your-first-assessment)
3. [Completing an Assessment](#completing-an-assessment)
4. [Viewing Results](#viewing-results)
5. [Understanding Reports](#understanding-reports)
6. [Advanced Features](#advanced-features)
7. [Tips and Best Practices](#tips-and-best-practices)

---

## Getting Started

### 1. Start the Application

Make sure both the backend and frontend servers are running:

**Backend (Terminal 1):**
```bash
cd backend
source venv/bin/activate
python run.py
```
The backend will run on `http://localhost:8001`

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

### 2. Open the Application

Open your browser and navigate to: **http://localhost:3000**

You'll see the home page with:
- A hero section explaining the tool
- PPI-F dimensions overview (Performance, Production Readiness, Infrastructure Efficiency, Failure Resilience)
- Organizations section

---

## Creating Your First Assessment

### Step 1: Create an Organization

1. On the home page, click **"Start Your First Assessment"** or **"New Assessment"** in the navigation
2. You'll be taken to the "Create Organization" page
3. Fill in:
   - **Organization Name**: Your company or team name (required)
   - **Domain**: Your organization's domain (optional)
4. Click **"Create Organization"**

### Step 2: Create an Assessment

1. After creating an organization, you'll be redirected to the organization's assessments page
2. Click **"Create New Assessment"**
3. Fill in:
   - **Assessment Name**: e.g., "Q1 2024 Engineering Maturity Assessment"
   - **Version**: Optional version identifier (defaults to "1.0")
4. Click **"Create Assessment"**

---

## Completing an Assessment

### Understanding the Assessment Interface

Once you create an assessment, you'll see the assessment questionnaire page with:

- **Progress Indicators**: Shows your progress for each dimension and overall
- **Question Navigation Sidebar**: Lists all questions organized by dimension
- **Current Question**: The question you're currently answering
- **Answer Options**: Different input types depending on the question:
  - **Single Select**: Radio buttons
  - **Multi Select**: Checkboxes
  - **Numeric**: Number input
  - **Free Text**: Text area

### Answering Questions

1. **Read the question carefully** - Each question is designed to assess a specific aspect of your engineering maturity

2. **Select or enter your answer** based on your current practices

3. **Auto-save**: Your answers are automatically saved as you progress

4. **Navigate between questions**:
   - Use **Previous** and **Next** buttons
   - Click on any question in the sidebar to jump to it
   - Use the search/filter to find specific questions

5. **Critical Questions**: Some questions are marked as critical - make sure to answer these

6. **Validation**: The system will prevent you from completing the assessment if critical questions are unanswered

### Completing the Assessment

1. Once you've answered all questions (or at least all critical ones), click **"Complete Assessment"**
2. The system will:
   - Calculate maturity scores for each dimension
   - Generate findings based on your answers
   - Create prioritized recommendations
   - Calculate overall maturity score and risk level

---

## Viewing Results

After completing an assessment, you'll see the results page with:

### 1. Executive Summary

- **Overall Maturity Score**: 0-5 scale
- **Risk Level**: Low, Medium, High, or Critical
- **Cost Leakage Estimate**: Estimated financial impact
- **Key Insights**: High-level takeaways

### 2. Dimension Scores

Visual representations of your scores:
- **Heatmap**: Color-coded view of maturity across dimensions
- **Radar Chart**: Visual comparison of all dimensions
- **Progress Indicators**: Detailed breakdown with percentages

### 3. Findings

- **Severity Levels**: Critical, High, Medium, Low
- **Organized by Dimension**: See findings for each PPI-F dimension
- **Descriptions**: Detailed explanations of each finding

### 4. Recommendations

- **Prioritization Matrix**: Visual representation of effort vs. impact
  - **Quick Wins**: Low effort, high impact
  - **Major Projects**: High effort, high impact
  - **Fill-ins**: Low effort, low impact
  - **Thankless Tasks**: High effort, low impact
- **Status Tracking**: Track recommendation status (pending, in_progress, completed, skipped)
- **Details**: Each recommendation includes:
  - Title and description
  - Effort level (Low, Medium, High)
  - Impact level (Low, Medium, High)
  - Timeline estimate
  - Priority score
  - Related KPIs

### 5. Assessment Tools

- **Notes**: Add notes and comments to your assessment
- **Tags**: Organize assessments with custom tags
- **Custom Fields**: Add additional metadata

---

## Understanding Reports

### Export Options

You can export your assessment in multiple formats:

1. **PDF Reports**:
   - **Full Report**: Complete assessment with all details
   - **Executive Report**: High-level summary for leadership
   - **Engineering Report**: Technical details for engineering teams

2. **JSON Export**: Machine-readable format for integration

3. **CSV Export**: Recommendation backlog for project management tools

4. **Excel Export**: Spreadsheet format with multiple sheets

### Report Contents

**PDF Reports include:**
- Executive summary
- Dimension scores and visualizations
- Detailed findings
- Prioritized recommendations
- Action roadmap (30/60/90 days)

---

## Advanced Features

### 1. Assessment Comparison

Compare two assessments to track progress:
1. Go to an assessment's results page
2. Click **"Compare with Another Assessment"**
3. Select the assessment to compare
4. View side-by-side comparison of scores and changes

### 2. Assessment Cloning

Create a copy of an existing assessment:
1. Go to the assessments list
2. Click the **"Clone"** button on an assessment
3. Provide a new name for the cloned assessment
4. All answers will be copied to the new assessment

### 3. Analytics Dashboard

View organization-level analytics:
1. Navigate to an organization
2. Click **"Analytics"** in the navigation
3. View:
   - **Trends**: Maturity trends over time
   - **Metrics**: Aggregated organization metrics
   - **Benchmark Comparison**: Compare against industry benchmarks

### 4. Bulk Operations

Perform actions on multiple assessments:
- **Bulk Status Update**: Update recommendation statuses in bulk
- **Bulk Delete**: Delete multiple assessments at once
- **Bulk Summary**: Get summary for multiple assessments

### 5. Advanced Filtering

Filter assessments by:
- **Status**: draft, in_progress, completed
- **Search**: Search by name or tags
- **Date Range**: Filter by creation or completion date

### 6. Webhooks and Integrations

Set up webhooks to integrate with other systems:
1. Go to **"Integrations"** in an organization
2. Create a webhook subscription
3. Configure events to subscribe to (assessment.created, assessment.completed, etc.)
4. Set up HMAC verification for security

### 7. Notifications

Stay informed about:
- Assessment completions
- New recommendations
- Important updates
- View unread count in the notification bell

---

## Tips and Best Practices

### 1. Answer Honestly

- Be honest about your current state
- The assessment is only as good as your answers
- It's okay to have low scores - that's why you're doing the assessment!

### 2. Involve the Right People

- Include team members who understand different aspects of your engineering
- Consider multiple perspectives for a more accurate assessment

### 3. Review Recommendations Carefully

- Focus on "Quick Wins" first for immediate impact
- Plan "Major Projects" for longer-term improvements
- Use the prioritization matrix to guide your roadmap

### 4. Track Progress Over Time

- Run assessments quarterly or bi-annually
- Compare results to see improvements
- Use the analytics dashboard to visualize trends

### 5. Export and Share

- Export executive reports for leadership
- Share engineering reports with your team
- Use CSV exports to create tickets in project management tools

### 6. Use Tags and Notes

- Tag assessments by quarter, team, or project
- Add notes about context or decisions
- This helps when reviewing historical assessments

### 7. Leverage Custom Fields

- Add metadata relevant to your organization
- Track additional context (team size, tech stack, etc.)
- Use for filtering and organization

---

## Common Workflows

### Quarterly Assessment Workflow

1. **Q1 Start**: Create new assessment for Q1
2. **Complete Assessment**: Answer all questions
3. **Review Results**: Analyze scores and recommendations
4. **Prioritize Actions**: Use prioritization matrix
5. **Export Reports**: Share with stakeholders
6. **Track Progress**: Update recommendation statuses
7. **Q2 Start**: Create Q2 assessment and compare with Q1

### New Team Onboarding

1. Create organization for the new team
2. Complete initial assessment (baseline)
3. Review findings and recommendations
4. Create action plan from recommendations
5. Set up webhooks for integration with their tools
6. Schedule follow-up assessment in 90 days

### Executive Reporting

1. Complete assessment
2. Export Executive PDF report
3. Review key insights and risk level
4. Present findings to leadership
5. Get buy-in for recommended actions

---

## Troubleshooting

### Assessment Won't Complete

- Check that all critical questions are answered
- Look for validation errors on the page
- Ensure you're connected to the backend

### Can't See Organizations

- Verify backend is running on port 8001
- Check browser console for errors
- Try refreshing the page

### Reports Not Generating

- Ensure backend has write permissions for the reports directory
- Check backend logs for errors
- Verify the assessment is completed

### Questions Not Loading

- Check backend connection
- Verify database is initialized
- Run `python -m app.init_questions` if needed

---

## Getting Help

- **API Documentation**: Visit `http://localhost:8001/api/docs` for interactive API docs
- **Backend Logs**: Check terminal running the backend for errors
- **Frontend Console**: Open browser DevTools (F12) to see frontend errors

---

## Next Steps

After completing your first assessment:

1. Review the recommendations and prioritize actions
2. Share results with your team
3. Create an action plan based on the prioritization matrix
4. Schedule follow-up assessments to track progress
5. Explore analytics to understand trends over time

Happy assessing! 🚀

