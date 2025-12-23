import { PrismaClient } from '@/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Prevent multiple instances during hot-reloads in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL

let prismaClientSingleton: PrismaClient

function createPrismaClient() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables')
  }

  const pool = new Pool({ 
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })
  
  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
  })
  
  const adapter = new PrismaPg(pool)

  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
