# Vercel Deployment Conversion Analysis

## Current Architecture Overview
- **Frontend**: React (Vite) - runs in browser
- **Backend**: Express.js with custom Node.js server
- **Database**: PostgreSQL with Drizzle ORM (currently using Neon)
- **External APIs**: Google Sheets API, Nodemailer for email
- **Hosting**: Currently on Replit (custom platform)

## Vercel Deployment Model
Vercel is a **serverless platform** with strict constraints:

1. **Request Timeout**: 15 seconds (Pro) / 30 seconds (Pro)
2. **No Long-running Processes**: Cannot keep server running between requests
3. **No Persistent File System**: Can only write to `/tmp` with 512MB limit
4. **API Routes**: Must use Handler-based architecture (async functions)
5. **Environment Variables**: No `.env` file - use dashboard
6. **Database**: Requires remote database (PostgreSQL/MySQL)
7. **No `express-session` with MemoryStore**: Requires external session storage
8. **No WebSockets**: Native streaming limitations

## Critical Issues Found

### 1. **problematic Dependencies**
```json
"memorystore": "^1.6.7" // In-memory session store - WON'T WORK
"express": "^4.21.2" // Full Express server - Vercel needs minimal server
"express-session": "^1.18.1" // Session management
"passport": "^0.7.0" // Authentication
"passport-local": "^1.0.0" // Local auth strategy
```

### 2. **Architecture Issues**

#### Issue A: Express Server Model
- **Current**: Single express server on port 5000
- **Problem**: Vercel serverless functions are stateless - can't have a persistent server
- **Solution**: Convert to Vercel API routes (`/api/` directory with handler functions)

#### Issue B: File Structure
- **Current**: 
  ```
  server/index.ts (creates Express app)
  server/routes.ts (registers routes)
  server/vite.ts (development middleware)
  ```
- **Problem**: This won't work on Vercel's serverless environment
- **Solution**: Create `/api/` directory with individual route handlers

#### Issue C: Google Sheets API
- **Current**: Uses public API key hardcoded in code
- **Problems**:
  - API key exposed in source code (security risk)
  - Rate limiting issues on Vercel cold starts
  - No caching mechanism across requests
- **Solution**: 
  - Move API key to environment variable
  - Implement caching strategy (Vercel KV or Redis)
  - Use service account for better reliability

#### Issue D: Email Service
- **Current**: Nodemailer with SMTP configuration
- **Issues**:
  - Requires environment variables: `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_HOST`, `EMAIL_PORT`
  - 127ms+ overhead per request on serverless
  - No retry mechanism if transient failures occur
- **Solution**: Keep as-is but ensure env vars are properly configured

#### Issue E: Session Management
- **Current**: Uses `memorystore` for express-session
- **Problem**: In-memory storage lost between serverless invocations
- **Solution**: Remove session management (not needed for booking system) or use Vercel KV

#### Issue F: Database Connection Management
- **Current**: Drizzle ORM with PostgreSQL/Neon
- **Problem**: Each serverless function creates new connection (expensive)
- **Solution**: 
  - Use Neon's connection pooling
  - Implement HTTP serverless driver for PostgreSQL

#### Issue G: Port Binding
- **Current**: `app.listen(process.env.PORT || 5000)`
- **Problem**: Vercel serverless handlers don't bind to ports
- **Solution**: Export handler function, not start server

#### Issue H: Build Output
- **Current**: Custom esbuild bundling in `package.json`
- **Problem**: Vercel has its own build system
- **Solution**: Use Vercel's default build process or configure `vercel.json`

#### Issue I: Static File Serving
- **Current**: Serves `/attached_assets` via express.static
- **Problem**: This won't work with serverless functions
- **Solution**: Upload assets to Vercel's static storage or external CDN

### 3. **Pricing Calculation Pipeline**

**Current Flow:**
```
Client (booking-section.tsx)
  ↓
API Call to /api/cleaning-fee
  ↓
googleSheetsService.getWholeHouseCleaningFee() (calls Google Sheets API)
  ↓
Client calculates total: roomCost + cleaningFee + extraGuestFee
  ↓
Sends totalPrice to POST /api/bookings
```

**Issues:**
- ✅ Google Sheets calls are per-request (good)
- ✅ Pricing calculation is client-side (reduces server load)
- ⚠️ No validation that client price matches server calculation
- ❌ No caching of room rates (could be expensive with many users)

**Solution:**
- Implement server-side pricing validation
- Add Redis cache for Google Sheets data with TTL
- Create dedicated `/api/calculate-price` endpoint
- Add pricing formula validation in server/rates.ts

### 4. **Booking Function Issues**

**Current Process:**
1. Client calculates total price
2. POST /api/bookings with booking data + calculated price
3. Server validates room type & date conflicts
4. Server checks Google Sheets for blocked dates
5. Creates database record
6. Sends email notification

**Vercel Compatibility Issues:**
- ⚠️ Email sends can timeout (127ms+ average)
- ❌ Google Sheets checks on every request (rate limiting)
- ✅ Database operations are OK with Drizzle + Neon pooling
- ❌ Error handling doesn't differentiate between conflicts

**Solutions:**
- Implement background job for email (use Vercel Cron + Redis queue or external service)
- Cache Google Sheets data with short TTL
- Implement proper error messages with conflict detection
- Add request validation middleware

## Database Connection Strategy

### Current: Using Neon PostgreSQL
**Advantages:**
- ✅ Manages connection pooling
- ✅ Supports Drizzle ORM
- ✅ Serverless-friendly

**To Optimize for Vercel:**
- Use Neon's HTTP API instead of TCP for better cold start performance
- OR use connection pooling endpoint
- Set connection timeout to 5000ms max

## Environment Variables Required

```
# Database
DATABASE_URL=postgresql://user:pass@host/db

# Google Sheets
GOOGLE_SHEETS_API_KEY=AIzaSy... (MOVE TO ENV)
GOOGLE_SHEETS_ID=1xKU0YZdoOWrhEKOeB...

# Email Service
EMAIL_USER=noreply@example.com
EMAIL_PASS=app-specific-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Sessions (if keeping auth)
SESSION_SECRET=your-secret-key

# Cache/Redis (optional but recommended)
REDIS_URL=redis://...
```

## Replit-Specific Code to Remove

1. **In `vite.config.ts`:**
   ```typescript
   process.env.REPL_ID !== undefined // Remove this check
   await import("@replit/vite-plugin-cartographer") // Remove plugin
   import("@replit/vite-plugin-runtime-error-modal") // Remove plugin
   ```

2. **In `package.json` devDependencies:**
   - `@replit/vite-plugin-cartographer`
   - `@replit/vite-plugin-runtime-error-modal`

## Conversion Steps Summary

### Phase 1: Code Structure
- [ ] Create `/api/` directory with route handlers
- [ ] Convert Express middleware to individual handlers
- [ ] Remove Replit-specific dependencies
- [ ] Update vite.config.ts for Vercel

### Phase 2: Server-Side Routes
- [ ] `/api/bookings/` - GET, POST, PATCH, DELETE
- [ ] `/api/bookings/range` - GET
- [ ] `/api/availability` - GET
- [ ] `/api/cleaning-fee` - GET
- [ ] `/api/extra-guest-fee` - GET
- [ ] `/api/calculate-price` - POST (NEW)

### Phase 3: External Integrations
- [ ] Google Sheets - move API key to env, add caching
- [ ] Email Service - ensure env vars configured
- [ ] Database - verify pooling settings

### Phase 4: Configuration Files
- [ ] Create `vercel.json`
- [ ] Update `package.json` build script
- [ ] Create `.env.example` with all required vars
- [ ] Update `tsconfig.json` if needed

### Phase 5: Testing & Validation
- [ ] Test all API routes locally with `vercel dev`
- [ ] Verify Google Sheets integration
- [ ] Test booking creation flow
- [ ] Verify email notifications
- [ ] Check pricing calculations

## Deployment Checklist

```
BEFORE DEPLOYING:

Database:
- [ ] Neon PostgreSQL connection configured
- [ ] Connection pooling enabled
- [ ] Migrations applied

Environment Variables (Vercel Dashboard):
- [ ] DATABASE_URL
- [ ] GOOGLE_SHEETS_API_KEY
- [ ] GOOGLE_SHEETS_ID
- [ ] EMAIL_USER
- [ ] EMAIL_PASS
- [ ] EMAIL_HOST
- [ ] EMAIL_PORT

Code Changes:
- [ ] No Replit dependencies
- [ ] No REPL_ID checks
- [ ] API routes in /api directory
- [ ] No express server binding to port
- [ ] Google Sheets API key in env

Build:
- [ ] `npm run build` succeeds locally
- [ ] `vercel build` succeeds
- [ ] No TypeScript errors

Testing:
- [ ] All API endpoints working
- [ ] Bookings save to database
- [ ] Email notifications send
- [ ] Pricing calculations correct
- [ ] Date availability correct
```

## Performance Considerations

1. **Cold Start Impact:**
   - First request to function takes 1-5 seconds
   - Subsequent requests within same container are instant
   - Solution: Implement lightweight dependency tree

2. **Database Connections:**
   - Create new connection per request (use connection pooling)
   - Consider Prisma's pooling layer

3. **Google Sheets API:**
   - Add caching with Redis or Vercel KV
   - Implement exponential backoff for retries

4. **Email Sending:**
   - Consider queuing system (Bull, Bee-Queue)
   - Or use external service (SendGrid, Mailgun)

## Migration Complexity

**Estimated Effort: MEDIUM-HIGH**

- **Easy**: File structure changes, env vars
- **Medium**: Converting routes to serverless handlers
- **Hard**: Properly implementing caching, error handling, validation

**Time Estimate**: 4-6 hours for complete conversion
