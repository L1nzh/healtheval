# Health Evaluation Platform - Project Brief

## Overview
A web application for collecting human evaluations of AI-generated doctor responses to patient concerns, designed for medical AI research and training data collection.

## Core Functionality

### User Flow
1. **Personal Information**: Users provide annotator ID, gender, age group, education level
2. **Evaluation Interface**: Users rate two AI responses on 5 criteria using 1-5 scale
3. **Data Submission**: Evaluations stored in MongoDB with timestamps

### Rating Criteria(fixed)
- Helpfulness
- Clarity
- Reassurance
- Feasibility
- Medical Accuracy

### Admin Features
- Secure login with password authentication
- View submission statistics
- Export data as CSV (annotators info + evaluation results)
- Session management with JWT tokens

## Technical Requirements
- **Frontend**: Next.js with TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB for data persistence
- **Authentication**: JWT-based admin authentication

## Success Metrics
- Collect structured evaluation data for medical AI research
- Provide efficient admin data management

## Target Users
- **Primary**: General public for diverse perspective collection
- **Admin**: Research administrators managing data collection