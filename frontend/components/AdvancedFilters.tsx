'use client'

import React from 'react'

interface AdvancedFiltersProps {
  filters: {
    status?: string
    search?: string
  }
  onFilterChange: (filters: { status?: string; search?: string }) => void
}

export default function AdvancedFilters({ filters, onFilterChange }: AdvancedFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Search Assessments
          </label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search by name..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        {(filters.status || filters.search) && (
          <button
            onClick={() => onFilterChange({})}
            className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}




