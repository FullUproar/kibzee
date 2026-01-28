import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

export async function setupTestDatabase() {
  try {
    // Reset database
    console.log('Resetting test database...')
    execSync('npx prisma migrate reset --force --skip-seed', {
      env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
    })

    // Run migrations
    console.log('Running migrations...')
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
    })

    // Seed test data
    console.log('Seeding test data...')
    await seedTestData()

    console.log('Test database setup complete!')
  } catch (error) {
    console.error('Failed to setup test database:', error)
    throw error
  }
}

async function seedTestData() {
  // Create test admin
  const testAdmin = await prisma.user.create({
    data: {
      email: 'test.admin@example.com',
      name: 'Test Admin',
      password: '$2a$10$K7L1OJ0TfPIkW3FqW8hDa.XnZzKHLKJqGxgmBQv3R3tqkF8F8VqQe', // password: test123
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  // Create test curator
  const testCurator = await prisma.user.create({
    data: {
      email: 'test.curator@example.com',
      name: 'Test Curator',
      password: '$2a$10$K7L1OJ0TfPIkW3FqW8hDa.XnZzKHLKJqGxgmBQv3R3tqkF8F8VqQe', // password: test123
      role: 'FOUNDER_CURATOR',
      status: 'ACTIVE',
      emailVerified: new Date(),
      curatorProfile: {
        create: {
          displayName: 'Test Curator',
          bio: 'Test curator profile',
          expertise: ['jazz', 'theater'],
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: testAdmin.id,
        },
      },
      preferences: {
        create: {
          categories: { CONCERT: 5, THEATER: 4 },
          genres: ['jazz', 'theater'],
          homeCity: 'South Bend',
        },
      },
    },
  })

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      email: 'test.user@example.com',
      name: 'Test User',
      password: '$2a$10$K7L1OJ0TfPIkW3FqW8hDa.XnZzKHLKJqGxgmBQv3R3tqkF8F8VqQe', // password: test123
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      preferences: {
        create: {
          categories: { CONCERT: 4, GALLERY_OPENING: 5 },
          genres: ['indie rock', 'contemporary art'],
          homeCity: 'Mishawaka',
        },
      },
    },
  })

  // Create test venue
  const testVenue = await prisma.venue.create({
    data: {
      name: 'Test Venue',
      slug: 'test-venue',
      description: 'A test venue for testing',
      address: '123 Test St',
      city: 'South Bend',
      state: 'IN',
      zipCode: '46601',
      region: 'michiana',
      venueType: 'theater',
    },
  })

  // Create test artist
  const testArtist = await prisma.artist.create({
    data: {
      name: 'Test Artist',
      slug: 'test-artist',
      bio: 'A test artist for testing',
      primaryGenre: 'jazz',
      genres: ['jazz', 'blues'],
      artForm: 'musician',
      isLocal: true,
      city: 'South Bend',
    },
  })

  // Create test event
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 7)
  futureDate.setHours(19, 30, 0, 0)

  const testEvent = await prisma.event.create({
    data: {
      title: 'Test Concert',
      slug: 'test-concert',
      description: 'A test concert for testing',
      shortDescription: 'Test concert',
      category: 'CONCERT',
      subcategory: 'jazz',
      startDate: futureDate,
      venueId: testVenue.id,
      curatorId: testCurator.id,
      priceMin: 1500,
      priceMax: 2500,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      sourceType: 'manual',
      artists: {
        create: {
          artistId: testArtist.id,
          role: 'headliner',
          order: 0,
        },
      },
    },
  })

  return { testAdmin, testCurator, testUser, testVenue, testArtist, testEvent }
}

export async function teardownTestDatabase() {
  await prisma.$disconnect()
}
