import Link from "next/link"
import Image from "next/image"

interface TeacherListProps {
  teachers: any[] // TODO: Add proper types
}

export default function TeacherList({ teachers }: TeacherListProps) {
  if (teachers.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="text-xl font-serif mb-2">No teachers found</h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your filters or search in a different area
        </p>
        <Link href="/teachers" className="btn btn-primary">
          Clear Filters
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Found {teachers.length} teacher{teachers.length !== 1 ? "s" : ""}
        </p>
        <select className="text-sm border border-gray-300 rounded-subtle px-3 py-1">
          <option>Sort by: Recommended</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Rating: High to Low</option>
          <option>Distance: Nearest</option>
        </select>
      </div>

      {teachers.map((teacher) => (
        <div key={teacher.id} className="card p-6 hover:shadow-medium transition-shadow">
          <div className="flex gap-6">
            {/* Teacher Photo */}
            <div className="flex-shrink-0">
              {teacher.user.image ? (
                <Image
                  src={teacher.user.image}
                  alt={teacher.user.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-sage/20 flex items-center justify-center">
                  <span className="text-3xl font-serif text-sage">
                    {teacher.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              {/* Verification Badge */}
              {teacher.identityVerified && (
                <div className="flex justify-center mt-2">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    ✓ Verified
                  </span>
                </div>
              )}
            </div>

            {/* Teacher Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-serif text-ink">
                    {teacher.user.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {teacher.city}, {teacher.state}
                  </p>
                </div>
                
                {/* Rating */}
                {teacher.reviewCount > 0 && (
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-gold">★</span>
                      <span className="font-medium">{teacher.averageRating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({teacher.reviewCount})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                {teacher.bio}
              </p>

              {/* Details */}
              <div className="flex flex-wrap gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-500">Teaches:</span>{" "}
                  <span className="font-medium">
                    {teacher.instrumentsTaught.slice(0, 3).join(", ")}
                    {teacher.instrumentsTaught.length > 3 && ` +${teacher.instrumentsTaught.length - 3} more`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Experience:</span>{" "}
                  <span className="font-medium">{teacher.yearsExperience} years</span>
                </div>
                <div>
                  <span className="text-gray-500">Ages:</span>{" "}
                  <span className="font-medium">
                    {teacher.ageGroups?.join(", ") || "All ages"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div>
                  {teacher.lowestRate > 0 && (
                    <p className="text-lg font-serif text-sage">
                      From ${(teacher.lowestRate / 100).toFixed(0)}/hour
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/teachers/${teacher.id}`}
                    className="btn btn-secondary"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/teachers/${teacher.id}/book`}
                    className="btn btn-primary"
                  >
                    Book Lesson
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Load More */}
      {teachers.length >= 20 && (
        <div className="text-center pt-6">
          <button className="btn btn-secondary">
            Load More Teachers
          </button>
        </div>
      )}
    </div>
  )
}