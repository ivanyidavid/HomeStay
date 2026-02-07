# Vercel Migration Checklist

Use this checklist to ensure your HomeStay website is fully prepared for Vercel deployment.

## Code Changes ✅ DONE

- [x] Removed Replit-specific dependencies from package.json
  - Removed `@replit/vite-plugin-cartographer`
  - Removed `@replit/vite-plugin-runtime-error-modal`
- [x] Updated vite.config.ts to remove Replit plugins
- [x] Created Vercel API routes in `/api/` directory
  - [x] `/api/bookings/index.ts` (GET, POST)
  - [x] `/api/bookings/[id].ts` (GET, PATCH, DELETE)
  - [x] `/api/bookings/range.ts` (GET by date range)
  - [x] `/api/availability/index.ts` (GET all availability)
  - [x] `/api/availability/[roomType].ts` (GET specific room)
  - [x] `/api/cleaning-fee.ts` (GET cleaning fees)
  - [x] `/api/extra-guest-fee.ts` (GET extra guest fees)
  - [x] `/api/calculate-price.ts` (POST calculate total)
- [x] Moved hardcoded API keys to environment variables
  - [x] GOOGLE_SHEETS_API_KEY in googleSheets.ts
  - [x] GOOGLE_SHEETS_ID configuration
- [x] Created database connection pooling utility (server/db.ts)
- [x] Updated package.json build scripts
- [x] Created vercel.json configuration file
- [x] Created .env.example with all required variables

## Environment Setup 🔧 TODO

- [ ] Create Vercel account at https://vercel.com
- [ ] Set up PostgreSQL database (use Neon: https://neon.tech)
- [ ] Get database connection string
- [ ] Set up Google Sheets API
  - [ ] Enable Google Sheets API in Google Cloud Console
  - [ ] Create API key
  - [ ] Copy Google Sheets ID
- [ ] Set up email service
  - [ ] Enable 2FA on Gmail account
  - [ ] Generate Gmail App Password

## Vercel Configuration 📋 TODO

- [ ] Connect GitHub repository to Vercel
- [ ] Add environment variables in Vercel dashboard:
  - [ ] `DATABASE_URL` - PostgreSQL connection string
  - [ ] `GOOGLE_SHEETS_API_KEY` - Google API key
  - [ ] `GOOGLE_SHEETS_ID` - Your Google Sheet ID
  - [ ] `EMAIL_USER` - Gmail address
  - [ ] `EMAIL_PASS` - Gmail app password
  - [ ] `EMAIL_HOST` - smtp.gmail.com
  - [ ] `EMAIL_PORT` - 587
- [ ] Configure build settings if needed

## Database Setup 🗄️ TODO

- [ ] Create PostgreSQL database (Neon recommended)
- [ ] Run initial migrations:
  ```bash
  npx drizzle-kit push --dialect postgresql
  ```
- [ ] Verify tables are created
- [ ] Test database connection from Vercel logs

## Testing Before Launch 🧪 TODO

### Local Testing
- [ ] Install dependencies: `npm install`
- [ ] Build frontend: `npm run build`
- [ ] Check TypeScript: `npm run check`
- [ ] Test booking API endpoints locally

### Vercel Testing
- [ ] Deploy to staging/preview URL
- [ ] Test home page loads
- [ ] Test API endpoints:
  - [ ] GET /api/bookings (should return []  or existing bookings)
  - [ ] GET /api/availability (should return room availability)
  - [ ] GET /api/cleaning-fee (should return fees)
  - [ ] POST /api/bookings (create test booking)
- [ ] Test booking form:
  - [ ] Load calendar with availability
  - [ ] Show correct pricing
  - [ ] Submit booking successfully
- [ ] Test email notifications (check Gmail)
- [ ] Check database records were created

### Performance Testing
- [ ] Check Vercel analytics
- [ ] Monitor API response times
- [ ] Check for cold start issues
- [ ] Review build output size

## Monitoring Setup 📊 TODO (Optional)

- [ ] Set up Vercel analytics
- [ ] Consider error tracking (Sentry)
- [ ] Set up database monitoring (Neon dashboard)
- [ ] Configure email alerts for deployment failures

## Launch Preparation 🚀 TODO

- [ ] Update DNS if using custom domain
  - [ ] Add Vercel nameservers
  - [ ] or configure CNAME record
- [ ] Set up auto-deployments (should be automatic with GitHub)
- [ ] Test production booking flow
- [ ] Gather feedback and monitor for issues

## Post-Launch 🎉 TODO

- [ ] Monitor Vercel logs for errors
- [ ] Monitor database performance
- [ ] Check email delivery (Gmail sent folder)
- [ ] Review first week of metrics
- [ ] Adjust settings based on usage

## Rollback Plan (If Issues)

If you encounter critical issues:

1. **Revert to Previous Vercel Deployment:**
   - Go to Vercel dashboard → Deployments
   - Find the previous working deployment
   - Click "Promote to Production"

2. **Revert Code Changes:**
   ```bash
   git revert <commit-sha>
   git push
   ```

3. **Check Vercel Logs:**
   - Go to Deployments
   - Click deployment
   - Review "Logs" and "Function Logs"

## Verification Checklist

After deployment, verify:

- [ ] Website loads at your Vercel URL
- [ ] All images display correctly
- [ ] Navigation works
- [ ] Calendar picker loads
- [ ] Room selection works
- [ ] Price calculation displays
- [ ] Booking submission works
- [ ] Confirmation message appears
- [ ] Database records save
- [ ] Admin gets email notification
- [ ] No console errors in browser
- [ ] No function timeout errors in Vercel logs

## Dependencies Removed (Won't Need These)

The following packages have been removed as they're incompatible with Vercel:

- `memorystore` - In-memory session storage (use external service if needed)
- `express-session` - Session management (not needed for stateless booking system)
- `passport` - Local authentication (custom auth not implemented)
- `passport-local` - Local strategy
- `connect-pg-simple` - PostgreSQL session store
- `esbuild` - Vercel handles bundling
- `google-auth-library` - Not needed (using API key)
- `tw-animate-css` - Unused animation library
- `ws` - WebSockets (not needed for this app)
- `@replit/vite-plugin-cartographer` - Replit-specific
- `@replit/vite-plugin-runtime-error-modal` - Replit-specific

## Quick Start Commands

```bash
# Install dependencies
npm install

# Type check
npm run check

# Build for production
npm run build

# Deploy to Vercel
vercel

# Run database migrations
npx drizzle-kit push

# Push code to GitHub (triggers auto-deploy)
git push origin main
```

## Support Resources

- [Vercel Troubleshooting Guide](https://vercel.com/support)
- [Neon Database Docs](https://neon.tech/docs)
- [Google Sheets API Errors](https://developers.google.com/sheets/api/guides/error-responses)
- [SMTP/Email Troubleshooting](https://nodemailer.com/smtp/)

---

**Last Updated:** February 7, 2026

**Status:** Ready for Vercel Deployment

**Estimated Time to Deploy:** 30-60 minutes

**Next Step:** Create Vercel account and connect GitHub repository
