# Development Workflow

## Development Process

### 1. Code Analysis
- Read and understand existing codebase
- Identify current architecture patterns
- Review database schema and API endpoints
- Check environment configuration

### 2. Planning Phase
- Reference `claude.md` for constraints
- Update `status.md` with current state
- Plan implementation steps

### 3. Implementation
- Add proper loading states
- Ensure mobile responsiveness

### 4. Testing
- Manual testing of all user flows
- API endpoint validation
- Database operation verification
- Admin functionality testing

### 5. Documentation
- Update relevant documentation files
- Comment only complex logic
- Update type definitions
- Maintain changelog

## Git Workflow
- Feature branches for new development
- Descriptive commit messages
- Code review before merge
- Tag releases with version numbers

## Environment Setup
```bash
# Development
npm run dev --turbopack

# Build
npm run build

# Production
npm run start
```

## Required Environment Variables
```env
ADMIN_PASSWORD=admin2025
JWT_SECRET=0cf31d5abf202e3e8116c7c24f27fcbc13c7b0261eada71f8a16c6ec3f31386f
MONGODB_URI=mongodb+srv://LINZHENGHONG:LINZHENGHONG@healtheval.zngmo6y.mongodb.net/?retryWrites=true&w=majority&appName=healtheval&tls=true&connectTimeoutMS=10000&serverSelectionTimeoutMS=10000&maxPoolSize=10&directConnection=false&loadBalanced=true
MONGODB_DB=annotation_db
```

## Code Review Checklist
- [ ] TypeScript errors resolved
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Documentation updated