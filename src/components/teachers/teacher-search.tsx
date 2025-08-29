"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const instruments = [
  "Piano",
  "Guitar",
  "Violin",
  "Drums",
  "Voice",
  "Bass",
  "Saxophone",
  "Trumpet",
  "Flute",
  "Cello",
  "Ukulele",
  "Clarinet",
]

export default function TeacherSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    instrument: searchParams.get("instrument") || "",
    location: searchParams.get("location") || "",
    format: searchParams.get("format") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
  })

  const handleSearch = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    router.push(`/teachers?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      instrument: "",
      location: "",
      format: "",
      priceMin: "",
      priceMax: "",
    })
    router.push("/teachers")
  }

  return (
    <div className="card p-6 sticky top-6">
      <h2 className="font-serif text-xl mb-4">Filter Teachers</h2>
      
      <div className="space-y-4">
        {/* Instrument */}
        <div>
          <label className="block text-sm font-medium mb-2">Instrument</label>
          <select
            value={filters.instrument}
            onChange={(e) => setFilters({ ...filters, instrument: e.target.value })}
            className="input"
          >
            <option value="">All Instruments</option>
            {instruments.map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            placeholder="City or ZIP code"
            className="input"
          />
        </div>

        {/* Lesson Format */}
        <div>
          <label className="block text-sm font-medium mb-2">Lesson Format</label>
          <select
            value={filters.format}
            onChange={(e) => setFilters({ ...filters, format: e.target.value })}
            className="input"
          >
            <option value="">Any Format</option>
            <option value="IN_PERSON">In Person</option>
            <option value="ONLINE">Online</option>
            <option value="BOTH">Both</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Price Range (per hour)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
              placeholder="Min"
              className="input"
              min="0"
            />
            <span className="self-center">-</span>
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
              placeholder="Max"
              className="input"
              min="0"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4">
          <button
            onClick={handleSearch}
            className="btn btn-primary w-full"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="btn btn-secondary w-full"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="mt-6 pt-6 border-t border-dust">
        <h3 className="text-sm font-medium mb-3">Popular Searches</h3>
        <div className="flex flex-wrap gap-2">
          {["Piano", "Guitar", "Voice", "Drums"].map((instrument) => (
            <button
              key={instrument}
              onClick={() => {
                setFilters({ ...filters, instrument })
                handleSearch()
              }}
              className="text-xs px-3 py-1 bg-dust rounded-full hover:bg-sage/20 transition-colors"
            >
              {instrument}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}