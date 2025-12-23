# Setup Checklist - BTech Question Paper Portal

Use this checklist to set up your project step by step. Check off each item as you complete it.

## Prerequisites ☑️

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Git installed (optional, for version control)
- [ ] Code editor (VS Code recommended)
- [ ] Web browser (Chrome/Firefox/Edge)

## Step 1: Supabase Setup ☑️

### Create Supabase Project
- [ ] Go to [https://supabase.com](https://supabase.com)
- [ ] Sign up or log in
- [ ] Click "New Project"
- [ ] Enter project details:
  - [ ] Project Name: `btech-papers`
  - [ ] Database Password: (Save this somewhere safe!)
  - [ ] Region: (Choose closest to you)
- [ ] Wait for project creation (2-3 minutes)

### Get Database Connection String
- [ ] Go to **Settings** → **Database**
- [ ] Find "Connection string" section
- [ ] Select **URI** mode
- [ ] Copy the connection string
- [ ] Replace `[YOUR-PASSWORD]` with your actual password
- [ ] Save this for later

### Get API Keys
- [ ] Go to **Settings** → **API**
- [ ] Copy the following and save them:
  - [ ] **Project URL** (starts with `https://`)
  - [ ] **anon public** key
  - [ ] **service_role** key (⚠️ Keep this secret!)

### Create Storage Bucket
- [ ] Go to **Storage** in left sidebar
- [ ] Click "Create a new bucket"
- [ ] Bucket name: `question-papers` (exact name, no spaces)
- [ ] Toggle **Public bucket** to **OFF** (keep private)
- [ ] Click "Create bucket"

## Step 2: Environment Configuration ☑️

- [ ] Open the project in your code editor
- [ ] Open the `.env` file
- [ ] Update with your Supabase credentials:
  ```env
  DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
  NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
  SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
  ```
- [ ] Save the file
- [ ] ⚠️ Never commit `.env` to version control!

## Step 3: Install Dependencies ☑️

Open terminal in project directory and run:

- [ ] `npm install`
- [ ] Wait for installation to complete (2-3 minutes)
- [ ] Check for any errors in terminal

## Step 4: Database Setup ☑️

Run these commands in order:

### Generate Prisma Client
- [ ] `npx prisma generate`
- [ ] Should see "Generated Prisma Client to ./src/generated/prisma"

### Run Database Migration
- [ ] `npx prisma migrate dev --name init`
- [ ] When prompted, confirm by typing `y`
- [ ] Should see "Your database is now in sync with your schema"
- [ ] This creates tables: branches, subjects, question_papers

### Seed Database with Sample Data
- [ ] `npm run seed`
- [ ] Should see:
  - ✅ Created 8 branches
  - ✅ Created subjects with question papers
  - 🎉 Database seeding completed!

## Step 5: Verify Setup ☑️

### Check Database in Prisma Studio
- [ ] Run `npx prisma studio`
- [ ] Browser opens at http://localhost:5555
- [ ] Click on "Branch" table - should see 8 branches
- [ ] Click on "Subject" table - should see subjects
- [ ] Click on "QuestionPaper" table - should see papers
- [ ] Close Prisma Studio (Ctrl+C in terminal)

### Start Development Server
- [ ] `npm run dev`
- [ ] Should see "Ready on http://localhost:3000"
- [ ] Open http://localhost:3000 in browser
- [ ] Should see home page with 8 branch cards

## Step 6: Test the Application ☑️

### Test Navigation
- [ ] Click on **CSE** (blue card)
- [ ] Should see semesters 1-8
- [ ] Click on **Semester 1**
- [ ] Should see subjects (Programming, Math, Physics, Graphics)
- [ ] Click on any subject (e.g., **CS101**)
- [ ] Should see list of question papers (2020-2024)

### Test Search
- [ ] On the subject page, type "2023" in search box
- [ ] Papers should filter to show only 2023
- [ ] Check URL - should have `?search=2023`
- [ ] Copy the URL and open in new tab - search should persist
- [ ] Clear search - all papers should show again

### Test Breadcrumbs
- [ ] Click "Home" in breadcrumb
- [ ] Should go back to home page
- [ ] Navigate again: CSE → Sem 1 → CS101
- [ ] Click "Semester 1" in breadcrumb
- [ ] Should go back to semester page

## Step 7: Upload PDFs (Optional) ☑️

### Option A: Manual Upload via Supabase Dashboard
- [ ] Go to Supabase project → Storage → question-papers
- [ ] Create folder: `cse`
- [ ] Inside `cse`, create folder: `sem1`
- [ ] Upload a PDF file, rename to: `CS101_2023.pdf`
- [ ] Go back to app, click on 2023 paper in CS101
- [ ] PDF should display in viewer

### Option B: Skip for Now
- [ ] Skip this step if you don't have PDFs ready
- [ ] App will show "Failed to load PDF" when clicking papers
- [ ] This is expected - you can add PDFs later

## Step 8: Explore Features ☑️

### PDF Viewer Controls (if PDFs uploaded)
- [ ] Click a paper to open PDF viewer
- [ ] Test **Previous/Next** page buttons
- [ ] Test **Zoom In** (+)
- [ ] Test **Zoom Out** (-)
- [ ] Test **Reset Zoom** (100%)

### Test Other Branches
- [ ] Go to home, click **ECE** (purple)
- [ ] Navigate through semesters and subjects
- [ ] Go to home, click **ME** (red)
- [ ] Verify color coding is consistent

### Test Responsive Design
- [ ] Open browser DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test mobile view (iPhone, Galaxy)
- [ ] Test tablet view (iPad)
- [ ] Verify layout adapts properly

## Common Issues & Solutions ☑️

### Issue: "Can't reach database server"
- [ ] Check DATABASE_URL in .env is correct
- [ ] Verify Supabase project is active
- [ ] Check internet connection
- [ ] Try restarting dev server

### Issue: "Module not found: @/generated/prisma"
- [ ] Run `npx prisma generate`
- [ ] Restart dev server (Ctrl+C, then `npm run dev`)

### Issue: "PDF fails to load"
- [ ] This is normal if you haven't uploaded PDFs yet
- [ ] Upload PDFs to Supabase Storage (see Step 7)
- [ ] Verify bucket name is exactly `question-papers`
- [ ] Check file paths match: `branch/semX/CODE_YEAR.pdf`

### Issue: Hot reload not working
- [ ] Delete `.next` folder
- [ ] Restart dev server

## Next Steps ☑️

### For Development
- [ ] Read [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for developer guide
- [ ] Open Prisma Studio to explore database
- [ ] Add more subjects via seed script or Prisma Studio
- [ ] Customize colors in `src/lib/constants.ts`

### For Production
- [ ] Read [README.md](./README.md) deployment section
- [ ] Push code to GitHub
- [ ] Deploy on Vercel
- [ ] Add environment variables in Vercel
- [ ] Test production deployment

## Documentation Reference ☑️

- [ ] **README.md** - Main documentation, features, architecture
- [ ] **SETUP.md** - Detailed setup guide with troubleshooting
- [ ] **QUICK_REFERENCE.md** - Developer quick reference
- [ ] **PROJECT_SUMMARY.md** - Implementation summary
- [ ] **.env.example** - Environment variables template

## Useful Commands Reference ☑️

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npx prisma studio       # Open database GUI
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Create migration
npm run seed           # Seed database

# Utilities
npm run lint           # Run linter
```

## Project Status ☑️

- [ ] Supabase project created and configured
- [ ] Environment variables set up
- [ ] Dependencies installed
- [ ] Database migrated and seeded
- [ ] Application running locally
- [ ] Navigation tested
- [ ] Search functionality tested
- [ ] (Optional) PDFs uploaded and viewable

---

## 🎉 Congratulations!

Once all items are checked, your BTech Question Paper Portal is fully set up and running!

**Need Help?**
- Check [SETUP.md](./SETUP.md) for detailed troubleshooting
- Review [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for development tips
- Refer to [README.md](./README.md) for architecture details

**Happy Coding! 🚀**
