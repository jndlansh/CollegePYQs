# BTech Question Paper Portal

A comprehensive web application for accessing BTech question papers across 8 engineering branches, built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and Supabase.

## Features

- 🎓 **8 Engineering Branches**: CSE, ECE, EEE, ME, CE, IT, Chemical, and Biotechnology
- 📚 **Organized by Hierarchy**: Branch → Semester (1-8) → Subject → Question Papers
- 🔍 **Search Functionality**: Debounced search with URL state for bookmarkable results
- 📄 **PDF Viewer**: Built-in PDF viewer with zoom and navigation controls
- 🔒 **Secure Storage**: Private Supabase bucket with 60-minute signed URLs
- ⚡ **Fast Performance**: Loading states and skeleton screens for optimal UX
- 🎨 **Color-Coded UI**: Unique colors for each branch for easy identification

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database ORM**: Prisma with PostgreSQL adapter
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **PDF Rendering**: react-pdf
- **Search**: use-debounce for optimized search

## Project Structure

```
papers/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Home - Branch selection
│   │   ├── loading.tsx               # Home loading state
│   │   ├── [branch]/                 # Dynamic branch route
│   │   │   ├── page.tsx              # Semester selection
│   │   │   ├── loading.tsx           # Branch loading state
│   │   │   └── [semester]/           # Dynamic semester route
│   │   │       ├── page.tsx          # Subject listing
│   │   │       ├── loading.tsx       # Semester loading state
│   │   │       └── [subject]/        # Dynamic subject route
│   │   │           ├── page.tsx      # Papers & PDF viewer
│   │   │           └── loading.tsx   # Subject loading state
│   ├── components/
│   │   ├── SearchBar.tsx             # Search with URL state
│   │   └── PDFViewer.tsx             # PDF rendering component
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma singleton client
│   │   ├── supabase.ts               # Supabase client
│   │   ├── constants.ts              # Branch config & types
│   │   └── actions/
│   │       └── storage.ts            # Server actions for storage
│   └── generated/
│       └── prisma/                   # Prisma generated client
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Database seeding script
└── package.json
```

## Database Schema

### Branch
- `id`: Unique identifier
- `name`: Full branch name (e.g., "Computer Science Engineering")
- `slug`: URL-friendly identifier (e.g., "cse")

### Subject
- `id`: Unique identifier
- `name`: Subject name
- `code`: Subject code (e.g., "CS201")
- `semester`: 1-8
- `branchId`: Foreign key to Branch

### QuestionPaper
- `id`: Unique identifier
- `year`: Year of the paper
- `fileUrl`: Supabase storage path
- `subjectId`: Foreign key to Subject

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- A Supabase account

### 2. Environment Configuration

Update the `.env` file in the root directory with your Supabase credentials:

```env
# Database Configuration (from Supabase project settings)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. Supabase Storage Setup

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create a new bucket named `question-papers`
4. Set the bucket to **private** (not public)
5. Configure RLS policies as needed

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Database Migration

```bash
npx prisma migrate dev --name init
```

### 6. Seed the Database

```bash
npm run seed
```

### 7. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Key Features Explained

### Nested Dynamic Routing
The app uses Next.js 15 App Router with nested dynamic segments:
- `/` - Home page with branch cards
- `/[branch]` - Semester selection for a branch
- `/[branch]/[semester]` - Subject listing for a semester
- `/[branch]/[semester]/[subject]` - Question papers and PDF viewer

### Search with URL State
The search component uses `useSearchParams` and `usePathname` to maintain search state in the URL, making searches bookmarkable and shareable.

### PDF Viewer
Uses `react-pdf` with dynamic imports (`ssr: false`) to prevent hydration errors. Includes:
- Page navigation
- Zoom controls (50% - 200%)
- Responsive design

### Signed URLs
Server Action generates temporary signed URLs (60 minutes) for secure access to private PDFs in Supabase storage.

### Loading States
Each route segment has a `loading.tsx` file with skeleton screens for optimal perceived performance.

## Development Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Seed database
npm run seed

# Prisma Studio (Database GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
Make sure to set all environment variables in your deployment platform:
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

