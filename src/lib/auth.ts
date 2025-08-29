import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import AppleProvider from "next-auth/providers/apple"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole, UserStatus } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  // @ts-expect-error - PrismaAdapter types are not fully compatible with NextAuth
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    verifyRequest: "/verify-email",
    newUser: "/onboarding",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        if (user.status === UserStatus.BANNED) {
          throw new Error("Account banned")
        }

        if (user.status === UserStatus.SUSPENDED) {
          throw new Error("Account suspended")
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: UserRole }).role || UserRole.STUDENT
      }
      
      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") {
        // For OAuth providers, check if user exists and update/create accordingly
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (existingUser) {
          // Update last login for existing users
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { 
              lastLoginAt: new Date(),
              emailVerified: existingUser.emailVerified || new Date()
            }
          })

          // Check if banned or suspended
          if (existingUser.status === UserStatus.BANNED) {
            return false
          }
          if (existingUser.status === UserStatus.SUSPENDED) {
            return false
          }
        } else {
          // Create new user for OAuth sign-in
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || profile?.name || "",
              image: user.image || (profile as { picture?: string })?.picture || null,
              emailVerified: new Date(),
              status: UserStatus.ACTIVE,
              role: UserRole.STUDENT,
              lastLoginAt: new Date()
            }
          })
        }
      }

      return true
    }
  },
  events: {
    async createUser({ user }) {
      // Send welcome email
      console.log("New user created:", user.email)
      // TODO: Implement email service
    },
    async signIn({ user }) {
      // Log sign-in event
      console.log("User signed in:", user.email)
    }
  },
  debug: process.env.NODE_ENV === "development",
}