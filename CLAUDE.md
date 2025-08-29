# Claude Development Standards

## Mandatory Files
These files MUST be present and referenced in every conversation:
- `claude.md` - This file with development standards
- `brief.md` - Project brief and requirements
- `workflow.md` - Development workflow and processes
- `status.md` - Current project status
- `kickoff.md` - Project setup and initialization

## Core Constraints

### Technology Stack
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with connection pooling
- **Authentication**: JWT with httpOnly cookies
- **State Management**: React Context API

### Code Standards
- Use TypeScript interfaces for all data types
- Write concise, focused code without unnecessary expansion
- Prioritize functionality over verbose implementations

### Security Requirements
- JWT tokens stored in httpOnly cookies
- Environment variables for sensitive data

### File Structure
```
src/
├── app/
│   ├── api/
│   ├── admin/
│   └── evaluation/
├── components/
├── context/
├── lib/
├── types/
└── utils/
```

### Database Schema
- Collections: `submissions`, `evaluations`
- All documents must include `timestamp` field

### Development Rules
1. Always validate environment variables
2. Implement proper loading states
3. Ensure mobile responsiveness

## Mandatory Documentation
Each development session must reference these files and update them as needed. No code changes without corresponding documentation updates.