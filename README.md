# Kibzee - Where Music Lives

A nonprofit platform connecting music students with qualified instructors in their local communities.

## 🎵 About Kibzee

Kibzee is a 501(c)(3) nonprofit organization dedicated to making arts education accessible by connecting students with passionate, verified music teachers. Our platform takes only a 5% fee, ensuring teachers keep 95% of their earnings while students pay fair prices.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Payment Processing**: Stripe Connect (coming soon)
- **Hosting**: Vercel (coming soon)

## 📋 Features

### For Students
- Search for teachers by instrument, location, and teaching style
- Read verified reviews from other students
- Secure payment processing with escrow protection
- In-person or online lessons
- Track progress and milestones

### For Teachers
- Keep 95% of earnings
- Professional profile with intro videos
- Flexible scheduling and pricing
- Background check verification
- Built-in video conferencing for online lessons

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/FullUproar/kibzee.git
cd kibzee
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
- Database connection string
- NextAuth secret
- OAuth provider credentials (Google, Facebook, Apple)
- Stripe API keys (when ready)

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎨 Design System

Our design follows an elegant, editorial aesthetic with:

- **Colors**: Sage green, clay orange, gold accents
- **Typography**: Georgia serif for headers, system fonts for body
- **Spacing**: 8px base unit system
- **Animations**: Subtle, purposeful transitions

## 📁 Project Structure

```
kibzee/
├── src/
│   ├── app/              # Next.js 14 app directory
│   ├── components/       # Reusable React components
│   ├── lib/             # Utilities and configurations
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── styles/          # Global styles
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
└── ...config files
```

## 🔐 Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
APPLE_ID=""
APPLE_SECRET=""

# Stripe (for later)
STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
```

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## 📝 Database Management

```bash
# Create a migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

## 🚀 Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic CI/CD on push to main branch

## 🤝 Contributing

As a nonprofit organization, we welcome contributions! Please see our contributing guidelines (coming soon).

## 📄 License

This project is proprietary software owned by Kibzee, a 501(c)(3) nonprofit organization.

## 🙏 Acknowledgments

Built with love for artists and learners everywhere.

---

**Kibzee** - Making music education accessible, one connection at a time.
