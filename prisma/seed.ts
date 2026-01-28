import { PrismaClient, EventCategory, EventStatus, CuratorStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import slugify from 'slugify'

const prisma = new PrismaClient()

function createSlug(text: string): string {
  return slugify(text, { lower: true, strict: true })
}

async function main() {
  console.log('Starting database seed...')

  // Clear existing data in correct order (respecting foreign keys)
  await prisma.conversationMessage.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.savedEvent.deleteMany()
  await prisma.eventTag.deleteMany()
  await prisma.eventArtist.deleteMany()
  await prisma.event.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.artist.deleteMany()
  await prisma.venue.deleteMany()
  await prisma.curatorProfile.deleteMany()
  await prisma.userPreferences.deleteMany()
  await prisma.legalAcceptance.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // ==========================================================================
  // USERS
  // ==========================================================================

  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  // Admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@kibzee.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  // Founder curators
  const curator1 = await prisma.user.create({
    data: {
      email: 'sarah@kibzee.com',
      name: 'Sarah Chen',
      password: userPassword,
      role: 'FOUNDER_CURATOR',
      status: 'ACTIVE',
      emailVerified: new Date(),
      curatorProfile: {
        create: {
          displayName: 'Sarah C.',
          bio: 'Music lover and jazz enthusiast. I spend my weekends checking out live shows in South Bend.',
          expertise: ['jazz', 'local bands', 'concerts'],
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: admin.id,
          eventsSubmitted: 15,
          eventsApproved: 14,
          curatedPicks: 5,
        },
      },
      preferences: {
        create: {
          categories: { CONCERT: 5, THEATER: 3, POETRY_READING: 4 },
          genres: ['jazz', 'indie rock', 'folk'],
          homeCity: 'South Bend',
          homeZip: '46601',
        },
      },
    },
  })

  const curator2 = await prisma.user.create({
    data: {
      email: 'marcus@kibzee.com',
      name: 'Marcus Williams',
      password: userPassword,
      role: 'FOUNDER_CURATOR',
      status: 'ACTIVE',
      emailVerified: new Date(),
      curatorProfile: {
        create: {
          displayName: 'Marcus W.',
          bio: 'Theater nerd and arts advocate. Former drama teacher at Riley High School.',
          expertise: ['theater', 'musicals', 'drama'],
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: admin.id,
          eventsSubmitted: 12,
          eventsApproved: 11,
          curatedPicks: 4,
        },
      },
      preferences: {
        create: {
          categories: { THEATER: 5, MUSICAL: 5, CONCERT: 2 },
          genres: ['drama', 'musical theater', 'improv'],
          homeCity: 'Mishawaka',
          homeZip: '46544',
        },
      },
    },
  })

  // Regular users
  const user1 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: userPassword,
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      preferences: {
        create: {
          categories: { CONCERT: 4, GALLERY_OPENING: 5, POETRY_READING: 3 },
          genres: ['contemporary art', 'indie rock', 'spoken word'],
          priceMax: 5000, // $50
          preferredDays: ['friday', 'saturday'],
          homeCity: 'South Bend',
          homeZip: '46617',
        },
      },
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'mike@example.com',
      name: 'Mike Johnson',
      password: userPassword,
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      preferences: {
        create: {
          categories: { CONCERT: 5, THEATER: 4 },
          genres: ['jazz', 'blues', 'classic rock'],
          includeFreeEvents: true,
          preferredDays: ['thursday', 'friday', 'saturday'],
          homeCity: 'Niles',
          homeZip: '49120',
        },
      },
    },
  })

  // ==========================================================================
  // VENUES
  // ==========================================================================

  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'The Morris Performing Arts Center',
        slug: 'morris-performing-arts-center',
        description: 'Historic 2,567-seat theater in downtown South Bend, hosting Broadway tours, concerts, and community events since 1922.',
        address: '211 N Michigan St',
        city: 'South Bend',
        state: 'IN',
        zipCode: '46601',
        latitude: 41.6768,
        longitude: -86.2520,
        region: 'michiana',
        phone: '(574) 235-9190',
        website: 'https://morriscenter.org',
        capacity: 2567,
        venueType: 'theater',
        accessibility: { wheelchair: true, hearing_loop: true, elevator: true },
        parking: 'Street parking and nearby garages available. Accessible parking on Main Street.',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Fiddlers Hearth',
        slug: 'fiddlers-hearth',
        description: 'Cozy Irish pub featuring live music, craft beers, and traditional Irish fare in the heart of downtown South Bend.',
        address: '127 N Main St',
        city: 'South Bend',
        state: 'IN',
        zipCode: '46601',
        latitude: 41.6753,
        longitude: -86.2513,
        region: 'michiana',
        phone: '(574) 232-2853',
        website: 'https://fiddlershearth.com',
        capacity: 150,
        venueType: 'bar',
        accessibility: { wheelchair: true },
        parking: 'Street parking and downtown garages.',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'South Bend Museum of Art',
        slug: 'south-bend-museum-of-art',
        description: 'Regional art museum featuring rotating exhibitions, permanent collection, and community programs in Century Center.',
        address: '120 Doctor Martin Luther King Jr Blvd',
        city: 'South Bend',
        state: 'IN',
        zipCode: '46601',
        latitude: 41.6742,
        longitude: -86.2494,
        region: 'michiana',
        phone: '(574) 235-9102',
        website: 'https://southbendart.org',
        capacity: 200,
        venueType: 'gallery',
        accessibility: { wheelchair: true, elevator: true },
        parking: 'Century Center parking garage.',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'The Lerner Theatre',
        slug: 'lerner-theatre',
        description: 'Beautifully restored 1920s movie palace in downtown Elkhart, now a premier performing arts venue.',
        address: '410 S Main St',
        city: 'Elkhart',
        state: 'IN',
        zipCode: '46516',
        latitude: 41.6818,
        longitude: -85.9766,
        region: 'michiana',
        phone: '(574) 293-4469',
        website: 'https://thelerner.com',
        capacity: 1600,
        venueType: 'theater',
        accessibility: { wheelchair: true, hearing_loop: true },
        parking: 'Downtown parking lot behind theater.',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Box Factory for the Arts',
        slug: 'box-factory-for-the-arts',
        description: 'Community arts center in a historic box factory building, featuring galleries, studios, and performance space.',
        address: '1101 Broad St',
        city: 'St. Joseph',
        state: 'MI',
        zipCode: '49085',
        latitude: 42.1090,
        longitude: -86.4894,
        region: 'michiana',
        phone: '(269) 983-3688',
        website: 'https://boxfactoryforthearts.org',
        capacity: 100,
        venueType: 'gallery',
        accessibility: { wheelchair: true },
        parking: 'Free lot on site.',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Buchanan Area District Library',
        slug: 'buchanan-library',
        description: 'Community library hosting author readings, poetry nights, and cultural programs.',
        address: '128 E Front St',
        city: 'Buchanan',
        state: 'MI',
        zipCode: '49107',
        latitude: 41.8273,
        longitude: -86.3611,
        region: 'michiana',
        phone: '(269) 695-3681',
        website: 'https://buchananlib.org',
        capacity: 75,
        venueType: 'library',
        accessibility: { wheelchair: true },
        parking: 'Free parking behind library.',
      },
    }),
  ])

  // ==========================================================================
  // ARTISTS
  // ==========================================================================

  const artists = await Promise.all([
    prisma.artist.create({
      data: {
        name: 'The Old Amusement Park',
        slug: 'the-old-amusement-park',
        bio: 'South Bend indie folk band known for their heartfelt lyrics and energetic live shows.',
        primaryGenre: 'indie folk',
        genres: ['indie folk', 'americana', 'rock'],
        artForm: 'musician',
        instagram: '@theoldamusementpark',
        spotify: 'theoldamusementpark',
        isLocal: true,
        city: 'South Bend',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'JD Simo',
        slug: 'jd-simo',
        bio: 'Blues/rock guitarist and singer known for his fiery performances and vintage tone.',
        primaryGenre: 'blues rock',
        genres: ['blues', 'rock', 'americana'],
        artForm: 'musician',
        website: 'https://jdsimo.com',
        instagram: '@jdsimo',
        isLocal: false,
      },
    }),
    prisma.artist.create({
      data: {
        name: 'South Bend Civic Theatre',
        slug: 'south-bend-civic-theatre',
        bio: 'Community theater company bringing quality productions to Michiana since 1957.',
        artForm: 'theater company',
        website: 'https://sbct.org',
        isLocal: true,
        city: 'South Bend',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Michiana Poetry Collective',
        slug: 'michiana-poetry-collective',
        bio: 'Local poets dedicated to building community through the spoken word.',
        artForm: 'poet',
        isLocal: true,
        city: 'South Bend',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Diana Rodriguez',
        slug: 'diana-rodriguez',
        bio: 'Contemporary visual artist exploring themes of identity and place through mixed media.',
        primaryGenre: 'contemporary',
        genres: ['contemporary', 'mixed media', 'installation'],
        artForm: 'visual artist',
        instagram: '@dianarodriguezart',
        isLocal: true,
        city: 'Mishawaka',
      },
    }),
  ])

  // ==========================================================================
  // TAGS
  // ==========================================================================

  const tags = await Promise.all([
    // Genre tags
    prisma.tag.create({ data: { name: 'Jazz', slug: 'jazz', category: 'genre' } }),
    prisma.tag.create({ data: { name: 'Blues', slug: 'blues', category: 'genre' } }),
    prisma.tag.create({ data: { name: 'Indie', slug: 'indie', category: 'genre' } }),
    prisma.tag.create({ data: { name: 'Folk', slug: 'folk', category: 'genre' } }),
    prisma.tag.create({ data: { name: 'Classical', slug: 'classical', category: 'genre' } }),
    prisma.tag.create({ data: { name: 'Contemporary Art', slug: 'contemporary-art', category: 'genre' } }),
    prisma.tag.create({ data: { name: 'Spoken Word', slug: 'spoken-word', category: 'genre' } }),
    // Vibe tags
    prisma.tag.create({ data: { name: 'Date Night', slug: 'date-night', category: 'vibe' } }),
    prisma.tag.create({ data: { name: 'Family Friendly', slug: 'family-friendly', category: 'vibe' } }),
    prisma.tag.create({ data: { name: 'Late Night', slug: 'late-night', category: 'vibe' } }),
    prisma.tag.create({ data: { name: 'Intimate', slug: 'intimate', category: 'vibe' } }),
    prisma.tag.create({ data: { name: 'Free Event', slug: 'free-event', category: 'vibe' } }),
  ])

  // ==========================================================================
  // EVENTS
  // ==========================================================================

  // Helper to create future dates
  const daysFromNow = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    date.setHours(19, 30, 0, 0) // Default 7:30 PM
    return date
  }

  const events = await Promise.all([
    // Concert at Fiddler's Hearth
    prisma.event.create({
      data: {
        title: 'The Old Amusement Park Live',
        slug: 'old-amusement-park-live-jan-2026',
        description: 'Join us for an intimate evening with South Bend\'s own The Old Amusement Park. They\'ll be playing songs from their new album plus fan favorites.',
        shortDescription: 'Intimate show with local indie folk favorites',
        category: EventCategory.CONCERT,
        subcategory: 'indie folk',
        startDate: daysFromNow(7),
        venueId: venues[1].id, // Fiddler's Hearth
        priceMin: 1000,
        priceMax: 1000,
        isFree: false,
        curatorId: curator1.id,
        curatorNotes: 'One of my favorite local bands - they always put on a great show at Fiddler\'s. Get there early for a good seat!',
        isCuratedPick: true,
        featured: true,
        featuredOrder: 1,
        status: EventStatus.PUBLISHED,
        publishedAt: new Date(),
        sourceType: 'manual',
        artists: {
          create: {
            artistId: artists[0].id,
            role: 'headliner',
            order: 0,
          },
        },
        tags: {
          create: [
            { tagId: tags.find(t => t.slug === 'indie')!.id },
            { tagId: tags.find(t => t.slug === 'folk')!.id },
            { tagId: tags.find(t => t.slug === 'intimate')!.id },
          ],
        },
      },
    }),

    // Blues concert at Morris
    prisma.event.create({
      data: {
        title: 'JD Simo Trio',
        slug: 'jd-simo-trio-feb-2026',
        description: 'Nashville guitar slinger JD Simo brings his power trio to the Morris for a night of blistering blues rock. Known for his vintage tone and explosive live performances.',
        shortDescription: 'Explosive blues rock from Nashville guitar phenom',
        category: EventCategory.CONCERT,
        subcategory: 'blues rock',
        startDate: daysFromNow(21),
        doorTime: new Date(daysFromNow(21).getTime() - 60 * 60 * 1000), // 1 hour before
        venueId: venues[0].id, // Morris
        priceMin: 2500,
        priceMax: 5500,
        ticketUrl: 'https://morriscenter.org/events',
        isFree: false,
        curatorId: curator1.id,
        curatorNotes: 'If you like Hendrix, SRV, or just face-melting guitar, don\'t miss this one.',
        isCuratedPick: true,
        status: EventStatus.PUBLISHED,
        publishedAt: new Date(),
        sourceType: 'manual',
        artists: {
          create: {
            artistId: artists[1].id,
            role: 'headliner',
            order: 0,
          },
        },
        tags: {
          create: [
            { tagId: tags.find(t => t.slug === 'blues')!.id },
            { tagId: tags.find(t => t.slug === 'date-night')!.id },
          ],
        },
      },
    }),

    // Theater production
    prisma.event.create({
      data: {
        title: 'Our Town',
        slug: 'our-town-civic-theatre-2026',
        description: 'Thornton Wilder\'s timeless classic about life, love, and loss in small-town America. Presented by South Bend Civic Theatre.',
        shortDescription: 'Classic American drama by the Civic Theatre',
        category: EventCategory.THEATER,
        subcategory: 'drama',
        startDate: daysFromNow(14),
        endDate: daysFromNow(28),
        isRecurring: true,
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH,FR,SA,SU',
        venueId: venues[0].id, // Morris
        priceMin: 1800,
        priceMax: 3200,
        ticketUrl: 'https://sbct.org/tickets',
        isFree: false,
        curatorId: curator2.id,
        curatorNotes: 'The Civic Theatre always does beautiful work with American classics. This one hits different in our small towns.',
        isCuratedPick: true,
        featured: true,
        featuredOrder: 2,
        status: EventStatus.PUBLISHED,
        publishedAt: new Date(),
        sourceType: 'manual',
        artists: {
          create: {
            artistId: artists[2].id,
            role: 'performer',
            order: 0,
          },
        },
        tags: {
          create: [
            { tagId: tags.find(t => t.slug === 'date-night')!.id },
            { tagId: tags.find(t => t.slug === 'family-friendly')!.id },
          ],
        },
      },
    }),

    // Gallery opening
    prisma.event.create({
      data: {
        title: 'Diana Rodriguez: Between Two Worlds',
        slug: 'diana-rodriguez-between-two-worlds',
        description: 'A new exhibition exploring themes of identity, migration, and belonging through mixed media installations and paintings.',
        shortDescription: 'New mixed media exhibition by local artist',
        category: EventCategory.GALLERY_OPENING,
        subcategory: 'contemporary',
        startDate: daysFromNow(10),
        venueId: venues[2].id, // South Bend Museum of Art
        isFree: true,
        curatorId: curator1.id,
        curatorNotes: 'Diana is one of the most exciting artists working in Michiana right now. Her work is deeply personal but universally resonant.',
        isCuratedPick: true,
        status: EventStatus.PUBLISHED,
        publishedAt: new Date(),
        sourceType: 'manual',
        artists: {
          create: {
            artistId: artists[4].id,
            role: 'featured',
            order: 0,
          },
        },
        tags: {
          create: [
            { tagId: tags.find(t => t.slug === 'contemporary-art')!.id },
            { tagId: tags.find(t => t.slug === 'free-event')!.id },
          ],
        },
      },
    }),

    // Poetry reading
    prisma.event.create({
      data: {
        title: 'First Fridays Open Mic Poetry',
        slug: 'first-fridays-open-mic-feb-2026',
        description: 'Monthly open mic poetry night hosted by the Michiana Poetry Collective. All skill levels welcome. Sign up starts at 6:30 PM.',
        shortDescription: 'Monthly open mic for poets of all levels',
        category: EventCategory.POETRY_READING,
        subcategory: 'open mic',
        startDate: daysFromNow(5),
        venueId: venues[5].id, // Buchanan Library
        isFree: true,
        curatorId: curator2.id,
        curatorNotes: 'A welcoming space for new and experienced poets alike. Great community vibe.',
        status: EventStatus.PUBLISHED,
        publishedAt: new Date(),
        sourceType: 'manual',
        artists: {
          create: {
            artistId: artists[3].id,
            role: 'host',
            order: 0,
          },
        },
        tags: {
          create: [
            { tagId: tags.find(t => t.slug === 'spoken-word')!.id },
            { tagId: tags.find(t => t.slug === 'free-event')!.id },
            { tagId: tags.find(t => t.slug === 'intimate')!.id },
          ],
        },
      },
    }),
  ])

  // ==========================================================================
  // SAVED EVENTS
  // ==========================================================================

  await Promise.all([
    prisma.savedEvent.create({
      data: {
        userId: user1.id,
        eventId: events[0].id, // Old Amusement Park
      },
    }),
    prisma.savedEvent.create({
      data: {
        userId: user1.id,
        eventId: events[3].id, // Gallery opening
      },
    }),
    prisma.savedEvent.create({
      data: {
        userId: user2.id,
        eventId: events[1].id, // JD Simo
      },
    }),
  ])

  // ==========================================================================
  // SAMPLE CONVERSATION
  // ==========================================================================

  const conversation = await prisma.conversation.create({
    data: {
      userId: user1.id,
      title: 'Looking for weekend plans',
      messages: {
        create: [
          {
            role: 'user',
            content: 'Hey! What\'s happening this weekend in South Bend? I\'m in the mood for some live music.',
          },
          {
            role: 'assistant',
            content: 'Great timing! There are some solid options for live music this weekend in South Bend. The Old Amusement Park is playing at Fiddler\'s Hearth - they\'re a local indie folk band that always puts on a fun show. It\'s an intimate venue, so I\'d recommend getting there early. Tickets are just $10.\n\nIf you\'re looking for something free, there\'s also the First Fridays Open Mic at the Buchanan Library - more spoken word/poetry, but there\'s usually some musical performances too.\n\nWant me to tell you more about either of these?',
            metadata: { eventsRecommended: [events[0].id, events[4].id], intent: 'discovery' },
          },
        ],
      },
    },
  })

  console.log('Database seeded successfully!')
  console.log('')
  console.log('Created:')
  console.log('- 1 admin user (admin@kibzee.com / admin123)')
  console.log('- 2 founder curators (sarah@kibzee.com, marcus@kibzee.com / user123)')
  console.log('- 2 regular users (jane@example.com, mike@example.com / user123)')
  console.log(`- ${venues.length} venues`)
  console.log(`- ${artists.length} artists`)
  console.log(`- ${events.length} events`)
  console.log(`- ${tags.length} tags`)
  console.log('- 3 saved events')
  console.log('- 1 sample conversation')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
