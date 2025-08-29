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

## Database Pagination Rules

### Implementation Standards
1. **API Endpoints**: Use consistent query parameters
   - `page`: Page number (default: 1)
   - `limit`: Items per page (default: 10, max: 50)

2. **Response Format**: Always include pagination metadata
   ```typescript
   {
     data: T[],
     pagination: {
       currentPage: number,
       totalPages: number,
       totalCount: number,
       hasNext: boolean,
       hasPrev: boolean
     }
   }
   ```

3. **Frontend State Management**
   - Use separate state for current page and page data
   - Implement loading states during data fetching
   - Reset form data when navigating between items
   - Handle empty states gracefully

4. **Navigation Controls**
   - Page-level: Navigate between database pages
   - Item-level: Browse items within current page
   - Disable buttons appropriately based on boundaries
   - Show current position indicators

5. **Error Handling**
   - Network failures should show user-friendly messages
   - Invalid page numbers should redirect to page 1
   - Empty results should display appropriate messaging

6. **Performance Considerations**
   - Use MongoDB skip/limit for server-side pagination
   - Avoid fetching all data and paginating client-side
   - Consider caching for frequently accessed pages

## Code Review Checklist
- [ ] TypeScript errors resolved
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Pagination controls functional
- [ ] Database queries optimized
- [ ] Documentation updated