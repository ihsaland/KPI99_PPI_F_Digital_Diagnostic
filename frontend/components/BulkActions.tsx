'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface BulkActionsProps {
  selectedIds: number[]
  onActionComplete: () => void
}

export default function BulkActions({ selectedIds, onActionComplete }: BulkActionsProps) {
  const [action, setAction] = useState<string>('')
  const [loading, setLoading] = useState(false)

  if (selectedIds.length === 0) {
    return null
  }

  const handleBulkAction = async () => {
    if (!action) {
      toast.error('Please select an action')
      return
    }

    setLoading(true)
    try {
      // This would call the bulk operations API
      // For now, we'll show a placeholder
      toast.success(`${selectedIds.length} items ${action}`)
      onActionComplete()
    } catch (error: any) {
      toast.error('Failed to perform bulk action')
    } finally {
      setLoading(false)
      setAction('')
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-900">
            {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={loading}
          >
            <option value="">Select action...</option>
            <option value="delete">Delete Selected</option>
            <option value="export">Export Selected</option>
          </select>
          <button
            onClick={handleBulkAction}
            disabled={!action || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Apply'}
          </button>
        </div>
        <button
          onClick={onActionComplete}
          className="text-sm text-slate-600 hover:text-slate-900 font-medium"
        >
          Clear Selection
        </button>
      </div>
    </div>
  )
}




