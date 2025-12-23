import { PrismaClient } from '../src/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { BRANCH_CONFIG } from '../src/lib/constants'
import 'dotenv/config'

// Create Prisma Client with adapter (same as src/lib/prisma.ts)
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...')

  // Create branches
  const branches = await Promise.all(
    Object.values(BRANCH_CONFIG).map((branch) =>
      prisma.branch.upsert({
        where: { slug: branch.slug },
        update: {},
        create: {
          name: branch.name,
          slug: branch.slug,
        },
      })
    )
  )

  console.log(`✅ Created ${branches.length} branches`)

  // Sample subjects for CSE branch (Semester 1-2)
  const cseSubjects = [
    // Semester 1
    {
      name: 'Engineering Mathematics - I',
      code: 'MATH101',
      semester: 1,
      branchSlug: 'cse',
    },
    {
      name: 'Engineering Physics',
      code: 'PHY101',
      semester: 1,
      branchSlug: 'cse',
    },
    {
      name: 'Programming for Problem Solving',
      code: 'CS101',
      semester: 1,
      branchSlug: 'cse',
    },
    {
      name: 'Engineering Graphics',
      code: 'ME101',
      semester: 1,
      branchSlug: 'cse',
    },
    // Semester 2
    {
      name: 'Engineering Mathematics - II',
      code: 'MATH102',
      semester: 2,
      branchSlug: 'cse',
    },
    {
      name: 'Data Structures',
      code: 'CS201',
      semester: 2,
      branchSlug: 'cse',
    },
    {
      name: 'Digital Logic Design',
      code: 'CS202',
      semester: 2,
      branchSlug: 'cse',
    },
    {
      name: 'Engineering Chemistry',
      code: 'CHEM101',
      semester: 2,
      branchSlug: 'cse',
    },
  ]

  // Create subjects and question papers
  for (const subjectData of cseSubjects) {
    const branch = branches.find((b) => b.slug === subjectData.branchSlug)
    if (!branch) continue

    const subject = await prisma.subject.upsert({
      where: {
        code_branchId: {
          code: subjectData.code,
          branchId: branch.id,
        },
      },
      update: {},
      create: {
        name: subjectData.name,
        code: subjectData.code,
        semester: subjectData.semester,
        branchId: branch.id,
      },
    })

    // Create question papers for years 2020-2024
    const years = [2020, 2021, 2022, 2023, 2024]
    for (const year of years) {
      await prisma.questionPaper.upsert({
        where: {
          // Create a unique constraint using subject and year
          id: `${subject.id}_${year}`,
        },
        update: {},
        create: {
          id: `${subject.id}_${year}`,
          year,
          fileUrl: `${subjectData.branchSlug}/sem${subjectData.semester}/${subjectData.code}_${year}.pdf`,
          subjectId: subject.id,
        },
      })
    }

    console.log(
      `✅ Created subject: ${subjectData.code} with ${years.length} question papers`
    )
  }

  // Add sample subjects for other branches (Semester 1)
  const otherBranchesSubjects = [
    // ECE
    { name: 'Electronic Devices', code: 'EC101', semester: 1, branchSlug: 'ece' },
    { name: 'Network Analysis', code: 'EC102', semester: 1, branchSlug: 'ece' },
    // ME
    { name: 'Engineering Mechanics', code: 'ME201', semester: 1, branchSlug: 'me' },
    { name: 'Thermodynamics', code: 'ME202', semester: 1, branchSlug: 'me' },
    // CE
    { name: 'Engineering Mechanics', code: 'CE101', semester: 1, branchSlug: 'ce' },
    { name: 'Surveying', code: 'CE102', semester: 1, branchSlug: 'ce' },
    // EEE
    { name: 'Electrical Circuits', code: 'EE101', semester: 1, branchSlug: 'eee' },
    { name: 'Electromagnetic Theory', code: 'EE102', semester: 1, branchSlug: 'eee' },
  ]

  for (const subjectData of otherBranchesSubjects) {
    const branch = branches.find((b) => b.slug === subjectData.branchSlug)
    if (!branch) continue

    const subject = await prisma.subject.upsert({
      where: {
        code_branchId: {
          code: subjectData.code,
          branchId: branch.id,
        },
      },
      update: {},
      create: {
        name: subjectData.name,
        code: subjectData.code,
        semester: subjectData.semester,
        branchId: branch.id,
      },
    })

    // Create sample papers for 2023-2024
    for (const year of [2023, 2024]) {
      await prisma.questionPaper.upsert({
        where: {
          id: `${subject.id}_${year}`,
        },
        update: {},
        create: {
          id: `${subject.id}_${year}`,
          year,
          fileUrl: `${subjectData.branchSlug}/sem${subjectData.semester}/${subjectData.code}_${year}.pdf`,
          subjectId: subject.id,
        },
      })
    }

    console.log(`✅ Created subject: ${subjectData.code}`)
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
