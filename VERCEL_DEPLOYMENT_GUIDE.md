# Vercel Deployment Guide - HomeStay Booking Website

## Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Repository** - Push your code to GitHub (Vercel integrates with GitHub)
3. **PostgreSQL Database** - Use Neon (https://neon.tech) - free tier available
4. **Google Sheets API Credentials** - For availability tracking
5. **Email Service** - Gmail account with App Password

## Step-by-Step Deployment

### 1. Set Up PostgreSQL Database

#### Using Neon (Recommended)

1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy the connection string (it will look like: `postgresql://user:password@host.neon.tech/dbname`)
4. Save this for later - you'll need it for Vercel environment variables

#### Alternative: Use Existing Database

If you have an existing database:
- Get your PostgreSQL connection string
- Ensure it's accessible from the internet (Vercel's servers need to connect)

### 2. Prepare Google Sheets API Credentials

1. **Enable Google Sheets API:**
   - Go to https://console.cloud.google.com
   - Create a new project
   - Search for "Google Sheets API" and enable it
   - Search for "Google Drive API" and enable it

2. **Create API Key:**
   - Go to "Credentials" in the sidebar
   - Click "Create Credentials" → "API Key"
   - Copy the API key

3. **Get Your Google Sheets ID:**
   - Open your Google Sheet
   - The ID is in the URL: `https://docs.google.com/spreadsheets/d/{ID}/edit`
   - Copy the ID portion

### 3. Set Up Email Service

We currently use Gmail with SMTP. Here's how to set it up:

1. **Enable 2-Factor Authentication on Your Gmail Account**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this password

3. **Email Configuration Values:**
   - `EMAIL_USER`: Your Gmail address (e.g., noreply@gmail.com)
   - `EMAIL_PASS`: The 16-character app password
   - `EMAIL_HOST`: smtp.gmail.com
   - `EMAIL_PORT`: 587

### 4. Deploy to Vercel

#### Option A: Via GitHub (Recommended)

1. **Push Your Code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect Vercel to GitHub:**
   - Go to https://vercel.com/new
   - Choose "Import Git Repository"
   - Search for your HomeStay repository
   - Click "Import"

3. **Configure Environment Variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variables:

   ```
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
   GOOGLE_SHEETS_API_KEY=AIzaSy...
   GOOGLE_SHEETS_ID=1xKU0YZdo...
   EMAIL_USER=noreply@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete

#### Option B: Via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   This will guide you through the setup process.

3. **Add Environment Variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add GOOGLE_SHEETS_API_KEY
   vercel env add GOOGLE_SHEETS_ID
   vercel env add EMAIL_USER
   vercel env add EMAIL_PASS
   vercel env add EMAIL_HOST
   vercel env add EMAIL_PORT
   ```

### 5. Run Database Migrations

After deploying, you need to apply database migrations:

```bash
# Using Vercel CLI
vercel env ls

# Run migrations
npx drizzle-kit push --dialect postgresql --schema ./shared/schema.ts
```

Or via Vercel's dashboard:
1. Go to your project settings
2. Go to "Environment Variables"  
3. Run a one-time function to apply migrations:

```bash
# Create a temporary API route at api/init-db.ts
# (This will be deleted after)
```

## Troubleshooting

### Database Connection Issues

**Error: "connect ECONNREFUSED"**
- Ensure DATABASE_URL is correct
- Check that your PostgreSQL server is accessible from the internet
- If using Neon, verify the connection string is the full connection URL

**Error: "too many connections"**
- Vercel has serverless limitations
- Solution: Use Neon's connection pooling endpoint instead of direct connection

### Google Sheets API Issues

**Error: "The caller does not have permission"**
- Verify the API key is correct
- Ensure Google Sheets API is enabled in Google Cloud Console
- Check that the sheet ID matches your actual sheet

**Error: "Quota exceeded for quota group"**
- Google Sheets API has rate limits
- Solution: Implement caching (see optimization section)

### Email Not Sending

**Error: "Invalid login credentials"**
- Verify EMAIL_USER and EMAIL_PASS
- Ensure you're using an App Password, not your regular Gmail password
- Check that 2FA is enabled on the Gmail account

**Error: "Timeout on email send"**
- Serverless functions have time limits
- Solution: Implement background job queuing (see optimization section)

### Build Errors

**Error: "esbuild not found"**
- This dependency was removed for Vercel - it shouldn't appear
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Error: "Replit plugins not found"**
- These were safely removed in the vite.config.ts update

## Testing Your Deployment

### 1. Test API Endpoints

```bash
# Get all bookings
curl https://your-vercel-app.vercel.app/api/bookings

# Get availability
curl https://your-vercel-app.vercel.app/api/availability

# Get cleaning fees
curl https://your-vercel-app.vercel.app/api/cleaning-fee

# Create test booking
curl -X POST https://your-vercel-app.vercel.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "checkIn": "2024-12-25",
    "checkOut": "2024-12-26",
    "guests": 2,
    "roomType": "double-bed",
    "guestName": "Test Guest",
    "guestEmail": "test@example.com",
    "guestPhone": "",
    "totalPrice": 10000
  }'
```

### 2. Test in Browser

1. Go to your Vercel deployment URL
2. Test the booking form
3. Try selecting dates and checking pricing
4. Submit a test booking

### 3. Check Logs

In Vercel dashboard:
1. Go to "Deployments"
2. Click your deployment
3. Go to "Logs" tab to see error messages

## Performance Optimization

### Caching Google Sheets Data

To reduce API calls and improve performance, implement caching:

```typescript
// Add to server/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getCached(key: string) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL) {
    return item.data;
  }
  cache.delete(key);
  return null;
}

export function setCached(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}
```

### Using Vercel KV for Distributed Caching

For production with multiple serverless functions:

1. Enable Vercel KV in your project settings
2. Install the package:
   ```bash
   npm install @vercel/kv
   ```
3. Update cache implementation to use Vercel KV

## Cost Optimization

### Database

- **Neon Free Tier**: Includes 3GB storage, sufficient for thousands of bookings
- **Upgrade if needed**: $0.135 per vCPU per day

### Google Sheets API

- **Free Tier**: 500 requests per day
- **Quoted**: If you exceed, upgrade to paid plan ($2-$5/month)

### Email

- **Gmail**: Free (with app password)
- **Alternative**: SendGrid ($20/month) for better reliability at scale

### Vercel

- **Hobby Plan** (Free): 1M serverless function invocations per month
  - 40 GB-seconds per month
- **Pro Plan** ($20/month): Unlimited invocations + better performance

## Next Steps

1. Monitor your deployment in the Vercel dashboard
2. Set up analytics/monitoring
3. Configure custom domain (optional)
4. Set up automatic deployments on git push
5. Implement error tracking (e.g., Sentry)

## Maintenance

### Regular Tasks

- **Weekly**: Monitor bookings in database
- **Monthly**: Review API quotas and usage
- **Quarterly**: Update dependencies and security patches

### Backing Up Data

Since you're using Neon, backups are automatic. To export data:

```bash
# Export PostgreSQL data
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon PostgreSQL Docs](https://neon.tech/docs)
- [Google Sheets API Reference](https://developers.google.com/sheets/api)
- [Nodemailer Documentation](https://nodemailer.com/)

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review the VERCEL_CONVERSION_ANALYSIS.md file
3. Test API endpoints individually
4. Check environment variables are set correctly
5. Review database connection settings

## Summary

Your HomeStay booking website is now ready for Vercel deployment! The key changes made:

✅ Removed Replit-specific dependencies
✅ Converted Express server to Vercel API routes
✅ Added environment variable configuration
✅ Set up Google Sheets API key management
✅ Configured email service for production
✅ Optimized database connections for serverless
✅ Added comprehensive error handling

The website will be live at your Vercel deployment URL immediately after deployment completes!
