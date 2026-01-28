"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"

interface EventFiltersProps {
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export interface FilterState {
  search: string
  category: string
  city: string
  dateRange: "upcoming" | "this-week" | "this-month" | "all"
  priceRange: "all" | "free" | "paid"
}

const categories = [
  { value: "", label: "All Categories" },
  { value: "CONCERT", label: "Concerts" },
  { value: "THEATER", label: "Theater" },
  { value: "MUSICAL", label: "Musicals" },
  { value: "GALLERY_OPENING", label: "Gallery Openings" },
  { value: "POETRY_READING", label: "Poetry Readings" },
  { value: "DANCE", label: "Dance" },
  { value: "FILM", label: "Film" },
  { value: "LITERARY", label: "Literary" },
]

const cities = [
  { value: "", label: "All Cities" },
  { value: "South Bend", label: "South Bend" },
  { value: "Mishawaka", label: "Mishawaka" },
  { value: "Elkhart", label: "Elkhart" },
  { value: "Niles", label: "Niles" },
  { value: "St. Joseph", label: "St. Joseph" },
  { value: "Buchanan", label: "Buchanan" },
]

const dateRanges = [
  { value: "upcoming", label: "Upcoming" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "all", label: "All Dates" },
]

const priceRanges = [
  { value: "all", label: "Any Price" },
  { value: "free", label: "Free Only" },
  { value: "paid", label: "Paid Only" },
]

export default function EventFilters({
  onFilterChange,
  initialFilters,
}: EventFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      search: "",
      category: "",
      city: "",
      dateRange: "upcoming",
      priceRange: "all",
    }
  )
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      search: "",
      category: "",
      city: "",
      dateRange: "upcoming",
      priceRange: "all",
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.city ||
    filters.dateRange !== "upcoming" ||
    filters.priceRange !== "all"

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search events, venues, artists..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage outline-none"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="md:hidden flex items-center gap-2 mt-3 text-sage"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="w-2 h-2 bg-clay rounded-full" />
        )}
      </button>

      {/* Filters */}
      <div
        className={`mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 ${
          showMobileFilters ? "block" : "hidden md:grid"
        }`}
      >
        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage outline-none"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* City */}
        <select
          value={filters.city}
          onChange={(e) => updateFilter("city", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage outline-none"
        >
          {cities.map((city) => (
            <option key={city.value} value={city.value}>
              {city.label}
            </option>
          ))}
        </select>

        {/* Date Range */}
        <select
          value={filters.dateRange}
          onChange={(e) => updateFilter("dateRange", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage outline-none"
        >
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <select
          value={filters.priceRange}
          onChange={(e) => updateFilter("priceRange", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage outline-none"
        >
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="mt-3 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
          Clear filters
        </button>
      )}
    </div>
  )
}
