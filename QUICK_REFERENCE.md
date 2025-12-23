# Quick Reference Guide - BTech Question Paper Portal

## Project Overview

A full-stack web application for managing and accessing BTech question papers across 8 engineering branches using Next.js 15, TypeScript, Prisma, and Supabase.

## Architecture Summary

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma 7 with @prisma/adapter-pg
- **Storage**: Supabase Storage (private bucket)
- **PDF Rendering**: react-pdf
- **Search**: use-debounce

### Key Features
1. **Nested Dynamic Routing**: Branch → Semester → Subject → Papers
2. **URL-based Search**: Bookmarkable search with debouncing
3. **Secure Storage**: Private Supabase bucket with 60-min signed URLs
4. **PDF Viewer**: Client-side rendering with zoom and navigation
5. **Loading States**: Skeleton screens for all routes
6. **Color Coding**: 8 unique colors for branches

## Quick Commands

```bash
# Development
npm run dev                    # http://localhost:3000

# Database
npx prisma studio             # GUI at http://localhost:5555
npx prisma generate           # Generate Prisma client
npx prisma migrate dev        # Create & apply migration
npm run seed                  # Seed database with sample data

# Production
npm run build                 # Build for production
npm start                     # Start production server

# Utilities
npm run lint                  # Run ESLint
```

## File Structure Quick Reference

```
src/
├── app/                                    # App Router pages
│   ├── page.tsx                           # Home: Branch selection
│   ├── [branch]/page.tsx                  # Semester selection
│   ├── [branch]/[semester]/page.tsx       # Subject listing
│   └── [branch]/[semester]/[subject]/
│       └── page.tsx                       # Papers + PDF viewer
├── components/
│   ├── SearchBar.tsx                      # Search with URL state
│   └── PDFViewer.tsx                      # PDF viewer with controls
├── lib/
│   ├── prisma.ts                          # Prisma singleton
│   ├── supabase.ts                        # Supabase client
│   ├── constants.ts                       # Branch config
│   └── actions/storage.ts                 # Server actions
└── generated/prisma/                      # Prisma client (generated)
```

## Database Schema Quick View

```
Branch (branches)
├── id (String, CUID)
├── name (String)
├── slug (String, unique)
└── subjects → Subject[]

Subject (subjects)
├── id (String, CUID)
├── name (String)
├── code (String)
├── semester (Int, 1-8)
├── branchId → Branch
└── questionPapers → QuestionPaper[]

QuestionPaper (question_papers)
├── id (String, CUID)
├── year (Int)
├── fileUrl (String)
└── subjectId → Subject
```

## API Routes & Server Actions

### Server Actions (src/lib/actions/storage.ts)

```typescript
// Generate signed URL for private PDF access
getSignedUrl(filePath: string): Promise<string | null>

// Upload question paper to Supabase Storage
uploadQuestionPaper(file: File, path: string): Promise<string | null>
```

## Branch Configuration (src/lib/constants.ts)

```typescript
BRANCH_CONFIG = {
  cse: { name: "Computer Science Engineering", color: "bg-blue-500", ... },
  ece: { name: "Electronics & Communication", color: "bg-purple-500", ... },
  eee: { name: "Electrical & Electronics", color: "bg-yellow-500", ... },
  me: { name: "Mechanical Engineering", color: "bg-red-500", ... },
  ce: { name: "Civil Engineering", color: "bg-green-500", ... },
  it: { name: "Information Technology", color: "bg-indigo-500", ... },
  che: { name: "Chemical Engineering", color: "bg-orange-500", ... },
  biotech: { name: "Biotechnology", color: "bg-teal-500", ... }
}
```

## URL Structure & Routing

```
/                                    → Home (branch cards)
/cse                                 → CSE semesters (1-8)
/cse/1                              → CSE Semester 1 subjects
/cse/1/cs101                        → CS101 papers + viewer
/cse/1/cs101?search=2023           → Search: papers from 2023
/cse/1/cs101?paper=abc123          → View specific paper
/cse/1/cs101?search=2023&paper=abc → Search + view paper
```

## Component Props Quick Reference

### SearchBar (Client Component)
```typescript
// No props - uses URL params internally
// Syncs with URL via useSearchParams and useRouter
```

### PDFViewer (Client Component)
```typescript
interface PDFViewerProps {
  fileUrl: string    // Signed URL from Supabase
  fileName: string   // Display name (e.g., "CS101_2023.pdf")
}
```

## Environment Variables

```env
DATABASE_URL                      # Supabase PostgreSQL connection
NEXT_PUBLIC_SUPABASE_URL         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY    # Supabase anon public key
SUPABASE_SERVICE_ROLE_KEY        # Supabase service role (secret)
```

## Supabase Storage Structure

```
question-papers/                  # Bucket name (private)
├── cse/
│   ├── sem1/
│   │   ├── CS101_2023.pdf
│   │   ├── CS101_2024.pdf
│   │   └── ...
│   ├── sem2/
│   └── ...
├── ece/
│   ├── sem1/
│   └── ...
└── ...
```

## Common Prisma Queries

```typescript
import { prisma } from '@/lib/prisma'

// Get all branches
const branches = await prisma.branch.findMany()

// Get subjects for branch & semester
const subjects = await prisma.subject.findMany({
  where: {
    branch: { slug: 'cse' },
    semester: 1
  },
  include: { questionPapers: true }
})

// Get subject with papers
const subject = await prisma.subject.findFirst({
  where: {
    code: 'CS101',
    branch: { slug: 'cse' }
  },
  include: {
    questionPapers: {
      orderBy: { year: 'desc' }
    }
  }
})

// Create question paper
await prisma.questionPaper.create({
  data: {
    year: 2024,
    fileUrl: 'cse/sem1/CS101_2024.pdf',
    subjectId: 'subject-id-here'
  }
})
```

## Development Workflow

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Make Schema Changes**
   ```bash
   # Edit prisma/schema.prisma
   npx prisma migrate dev --name describe_change
   npx prisma generate
   ```

3. **View Database**
   ```bash
   npx prisma studio
   ```

4. **Add Sample Data**
   ```bash
   # Edit prisma/seed.ts
   npm run seed
   ```

5. **Test in Browser**
   - Visit http://localhost:3000
   - Navigate through branches, semesters, subjects
   - Test search functionality
   - Check PDF viewer (requires actual PDFs in Storage)

## Deployment Checklist

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Import project from GitHub
   - Add environment variables (from .env)
   - Deploy

3. **Post-Deployment**
   - Verify database connection
   - Test file uploads to Supabase
   - Check signed URL generation

### Environment Variables in Vercel
- Go to Project Settings → Environment Variables
- Add all variables from `.env`
- Redeploy if needed

## Troubleshooting Quick Fixes

### "Module not found: Can't resolve '@/generated/prisma'"
```bash
npx prisma generate
```

### "Can't reach database server"
- Check DATABASE_URL in .env
- Verify Supabase project is active

### "PDF fails to load"
- Upload actual PDFs to Supabase Storage
- Check bucket name is `question-papers`
- Verify signed URL generation

### "Search not working"
- Ensure use-debounce is installed
- Check browser console for errors

### Hot reload issues in development
- Restart dev server: `Ctrl+C` then `npm run dev`
- Clear `.next` folder: `rm -rf .next` (or delete manually)

## Key Design Decisions

1. **Prisma Singleton**: Prevents multiple instances during hot-reloads
2. **Custom Prisma Output**: `src/generated/prisma` for cleaner imports
3. **Dynamic Imports for PDF**: Avoids SSR hydration errors
4. **URL-based Search**: Makes searches bookmarkable and shareable
5. **Server Actions**: Signed URLs generated server-side for security
6. **Loading States**: Skeleton screens for better UX
7. **Color Coding**: Unique colors help identify branches quickly

## Performance Optimizations

- Static params generation for all routes
- Database indexes on frequently queried fields
- Debounced search (300ms delay)
- Loading states with Suspense boundaries
- Optimized Prisma queries with selective includes

## Security Considerations

- Private Supabase bucket (not public)
- Signed URLs with 60-minute expiry
- Service role key kept server-side only
- Database connection via server components
- RLS policies on Supabase (configure as needed)

## Future Enhancements

1. **Admin Panel**: Upload PDFs, manage subjects
2. **Authentication**: User login for personalized experience
3. **Bookmarks**: Save favorite papers
4. **Download**: Direct PDF download option
5. **Analytics**: Track popular papers and subjects
6. **Search Enhancement**: Full-text search across papers
7. **Mobile App**: React Native version
8. **Dark Mode**: Theme toggle

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **react-pdf**: https://github.com/wojtekmaj/react-pdf
- **Tailwind CSS**: https://tailwindcss.com/docs
