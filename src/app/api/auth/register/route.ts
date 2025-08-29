import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { UserRole, UserStatus } from "@prisma/client"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["STUDENT", "TEACHER"]).default("STUDENT"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        role: validatedData.role as UserRole,
        status: UserStatus.PENDING_VERIFICATION,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      }
    })
    
    // Create profile based on role
    if (user.role === UserRole.STUDENT) {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          instrumentsInterest: [],
          availableDays: [],
        }
      })
    } else if (user.role === UserRole.TEACHER) {
      await prisma.teacherProfile.create({
        data: {
          userId: user.id,
          bio: "",
          yearsExperience: 0,
          city: "",
          state: "",
          zipCode: "",
          instrumentsTaught: [],
          teachingStyles: [],
          ageGroups: [],
          languages: ["English"],
          weeklySchedule: {},
        }
      })
    }
    
    // TODO: Send verification email
    
    return NextResponse.json({
      message: "Registration successful. Please check your email to verify your account.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    )
  }
}