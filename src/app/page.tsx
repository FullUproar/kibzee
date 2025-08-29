import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <>
      {/* Navigation */}
      <nav className="fixed w-full top-0 bg-paper/90 backdrop-blur-md z-50 border-b border-dust">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-serif text-ink">
              kibzee<span className="text-clay ml-1">•</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#how" className="text-ink hover:text-sage transition-colors">
                How it works
              </Link>
              <Link href="#trust" className="text-ink hover:text-sage transition-colors">
                Trust
              </Link>
              <Link href="#pricing" className="text-ink hover:text-sage transition-colors">
                Pricing
              </Link>
              {session ? (
                <Link href="/dashboard" className="btn btn-primary">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="btn btn-primary">
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-in">
              <h1 className="text-display-lg font-serif italic text-ink mb-2">
                &ldquo;Tell me and I forget, teach me and I may remember, involve me and I learn.&rdquo;
              </h1>
              <p className="text-clay mb-8">— Benjamin Franklin</p>
              
              <p className="text-xl text-gray-600 mb-8">
                Connect with passionate instructors in your neighborhood. Learn guitar in your living room, 
                master piano at the park, or find your voice in the studio.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn btn-primary">
                  Find Your Teacher
                </Link>
                <Link href="/register" className="btn btn-secondary">
                  Start Teaching
                </Link>
              </div>
            </div>
            
            <div className="relative h-[500px]">
              {/* Abstract shapes animation */}
              <div className="absolute w-72 h-72 bg-sage/30 rounded-full blur-3xl animate-drift top-10 left-10"></div>
              <div className="absolute w-64 h-64 bg-clay/30 rounded-full blur-3xl animate-drift animation-delay-2000 top-40 right-10"></div>
              <div className="absolute w-52 h-52 bg-gold/30 rounded-full blur-3xl animate-drift animation-delay-4000 bottom-10 left-32"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl text-ink/20">♫</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="trust" className="py-24 bg-dust">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-display-md font-serif text-ink">
              Built on trust, designed for artists
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-8 hover:-translate-y-1 transition-transform">
              <div className="text-5xl font-serif italic text-clay mb-4">01</div>
              <h3 className="text-xl font-serif mb-2">Your money, protected</h3>
              <p className="text-gray-600">
                Secure payments held in escrow until lessons complete. No more chasing checks or awkward cash exchanges.
              </p>
            </div>
            
            <div className="card p-8 hover:-translate-y-1 transition-transform">
              <div className="text-5xl font-serif italic text-clay mb-4">02</div>
              <h3 className="text-xl font-serif mb-2">Real people, real reviews</h3>
              <p className="text-gray-600">
                Every teacher verified, every review authenticated. We know trust is earned one lesson at a time.
              </p>
            </div>
            
            <div className="card p-8 hover:-translate-y-1 transition-transform">
              <div className="text-5xl font-serif italic text-clay mb-4">03</div>
              <h3 className="text-xl font-serif mb-2">Fair for everyone</h3>
              <p className="text-gray-600">
                Teachers keep 95% of their earnings. Students pay fair prices. No hidden fees, no surprises.
              </p>
            </div>
            
            <div className="card p-8 hover:-translate-y-1 transition-transform">
              <div className="text-5xl font-serif italic text-clay mb-4">04</div>
              <h3 className="text-xl font-serif mb-2">Always here to help</h3>
              <p className="text-gray-600">
                Real humans answer within hours. Because sometimes you need more than an FAQ page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-display-md font-serif text-center mb-16">
              Beautiful in its simplicity
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-8 items-start group">
                <span className="text-5xl font-serif italic text-sage">1</span>
                <div className="flex-1 pb-8 border-b border-dust group-hover:border-sage transition-colors">
                  <h3 className="text-xl font-serif mb-2">Discover</h3>
                  <p className="text-gray-600">
                    Search by instrument, style, or neighborhood. Read reviews, watch intro videos.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-8 items-start group">
                <span className="text-5xl font-serif italic text-sage">2</span>
                <div className="flex-1 pb-8 border-b border-dust group-hover:border-sage transition-colors">
                  <h3 className="text-xl font-serif mb-2">Connect</h3>
                  <p className="text-gray-600">
                    Message teachers directly. Schedule your first lesson when you&apos;re ready.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-8 items-start group">
                <span className="text-5xl font-serif italic text-sage">3</span>
                <div className="flex-1 pb-8 border-b border-dust group-hover:border-sage transition-colors">
                  <h3 className="text-xl font-serif mb-2">Learn</h3>
                  <p className="text-gray-600">
                    Meet in person or online. Pay through the platform. Build your skills.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-8 items-start group">
                <span className="text-5xl font-serif italic text-sage">4</span>
                <div className="flex-1 pb-8 border-b border-dust group-hover:border-sage transition-colors">
                  <h3 className="text-xl font-serif mb-2">Grow</h3>
                  <p className="text-gray-600">
                    Track your progress. Celebrate milestones. Become the musician you want to be.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-ink text-paper">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-display-md font-serif mb-8">
              A platform that respects your craft
            </h2>
            <div className="text-8xl font-serif italic text-gold my-12">5%</div>
            <p className="text-xl mb-12 opacity-90">
              That&apos;s all we take. Because we believe teachers deserve to earn from their expertise, 
              not feed a platform.
            </p>
            <Link href="/register" className="btn bg-paper text-ink hover:bg-dust">
              Start Teaching Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-dust">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-serif mb-4">kibzee</h3>
              <p className="text-gray-600">
                Making music education accessible, one connection at a time. 
                Built with love for artists and learners.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-sage mb-4">For Teachers</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-clay transition-colors">
                    How to get started
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-clay transition-colors">
                    Setting your rates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-clay transition-colors">
                    Safety guidelines
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-sage mb-4">For Students</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-clay transition-colors">
                    Finding the right teacher
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-clay transition-colors">
                    Preparing for lessons
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-clay transition-colors">
                    Practice tips
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-dust text-center text-sm text-gray-600">
            <p>&copy; 2024 Kibzee. A 501(c)(3) nonprofit organization. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}