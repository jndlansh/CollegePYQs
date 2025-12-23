# Setup Guide - BTech Question Paper Portal

This guide will walk you through setting up the BTech Question Paper Portal from scratch.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed on your machine
- **Git** installed (optional, for version control)
- A **Supabase** account (free tier works fine)

## Step-by-Step Setup

### Step 1: Supabase Project Setup

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign in or create a new account
   - Click "New Project"
   - Fill in:
     - Project Name: `btech-papers`
     - Database Password: (Generate a strong password and save it)
     - Region: Choose closest to your location
   - Click "Create new project" and wait for setup to complete

2. **Get Database Connection String**
   - In your project dashboard, go to **Settings** → **Database**
   - Under "Connection string", select **URI** mode
   - Copy the connection string (it looks like):
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
     ```
   - Replace `[YOUR-PASSWORD]` with your actual database password

3. **Get Supabase API Keys**
   - Go to **Settings** → **API**
   - Copy the following:
     - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
     - **anon public** key
     - **service_role** key (keep this secret!)

4. **Create Storage Bucket**
   - Go to **Storage** in the left sidebar
   - Click "Create a new bucket"
   - Bucket name: `question-papers`
   - **Public bucket**: Toggle OFF (keep it private)
   - Click "Create bucket"

5. **Configure Storage Policies** (Optional but recommended)
   - Click on the `question-papers` bucket
   - Go to "Policies" tab
   - Add policies for authenticated users to upload/read files based on your requirements

### Step 2: Project Configuration

1. **Update Environment Variables**

   Open the `.env` file in the root directory and update with your Supabase credentials:

   ```env
   # Database Configuration
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres"

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key-here"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   ```

   **Important**: Never commit the `.env` file to version control!

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React 19
- Prisma
- Supabase client
- react-pdf
- use-debounce
- And all development dependencies

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

This creates the Prisma client in `src/generated/prisma/` based on the schema.

### Step 5: Database Migration

Run the migration to create tables in your Supabase database:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the `branches`, `subjects`, and `question_papers` tables
- Set up relationships between tables
- Apply indexes for better performance

### Step 6: Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- 8 engineering branches
- Sample subjects for CSE (Semesters 1-2) with 5 papers each (2020-2024)
- Sample subjects for other branches (Semester 1) with 2 papers each

### Step 7: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the home page with all 8 branch cards.

## Testing the Application

### Test Navigation Flow

1. **Home Page** → Click on "CSE" branch
2. **Branch Page** → Click on "1" (Semester 1)
3. **Semester Page** → Click on any subject (e.g., "CS101")
4. **Subject Page** → You'll see a list of question papers

### Test Search Functionality

1. On the subject page, use the search bar to filter by year (e.g., type "2023")
2. Notice the URL updates with the search parameter
3. The search is bookmarkable - copy the URL and paste in a new tab

### Note about PDF Viewer

The PDF viewer component is fully functional, but the PDFs themselves need to be uploaded to Supabase Storage. The seed data creates placeholder paths, but you'll need to:

1. Upload actual PDF files to your Supabase `question-papers` bucket
2. Ensure the file paths match the structure: `{branch}/sem{semester}/{subjectCode}_{year}.pdf`
   
   Example: `cse/sem1/CS101_2023.pdf`

## Uploading Question Papers

### Option 1: Manual Upload via Supabase Dashboard

1. Go to **Storage** → `question-papers` bucket in Supabase dashboard
2. Create folder structure: `cse/sem1/`
3. Upload PDF files with naming convention: `CS101_2023.pdf`

### Option 2: Programmatic Upload (Future Enhancement)

You can create an admin panel using the `uploadQuestionPaper` function in `src/lib/actions/storage.ts`:

```typescript
import { uploadQuestionPaper } from '@/lib/actions/storage'

// In your component or API route
const file = /* File from input */
const path = `cse/sem1/CS101_2023.pdf`
const result = await uploadQuestionPaper(file, path)
```

## Troubleshooting

### Database Connection Issues

**Error**: "Can't reach database server"

**Solution**:
- Check your `DATABASE_URL` in `.env` is correct
- Ensure your Supabase project is active
- Verify your IP is not blocked (Supabase allows all IPs by default)

### Prisma Generate Fails

**Error**: Schema validation errors

**Solution**:
- Ensure you're using Prisma 7+ (check `package.json`)
- The `url` should be in `prisma.config.ts`, not in `schema.prisma`
- Run `npm install` to ensure all packages are up to date

### PDF Viewer Not Working

**Error**: PDF fails to load

**Solution**:
- Ensure you've uploaded actual PDF files to Supabase Storage
- Check the bucket name is `question-papers` (exact match)
- Verify the file paths in the database match the uploaded files
- Check browser console for CORS or signed URL errors

### Search Not Working

**Issue**: Search doesn't filter results

**Solution**:
- This is a client-side component - ensure JavaScript is enabled
- Check browser console for errors
- Verify `use-debounce` is installed: `npm list use-debounce`

## Next Steps

1. **Add More Data**: Run custom seed scripts or add data via Prisma Studio
2. **Upload PDFs**: Add actual question paper PDFs to Supabase Storage
3. **Customize Styling**: Modify colors in `src/lib/constants.ts`
4. **Add Authentication**: Implement auth for admin panel (upload PDFs)
5. **Deploy**: Deploy to Vercel for production use

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npx prisma studio       # Open database GUI
npx prisma migrate dev  # Create new migration
npm run seed           # Seed database

# Prisma
npx prisma generate    # Regenerate Prisma client
npx prisma db push     # Push schema changes without migration
npx prisma db pull     # Pull schema from database
```

## Support

If you encounter issues:

1. Check this setup guide thoroughly
2. Review the main [README.md](./README.md) for architecture details
3. Check Prisma logs: `npx prisma --version`
4. Check Next.js logs in the terminal

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [react-pdf Documentation](https://github.com/wojtekmaj/react-pdf)
