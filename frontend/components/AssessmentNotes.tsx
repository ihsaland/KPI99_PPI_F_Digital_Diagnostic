'use client'

import React, { useState } from 'react'
import { assessmentsApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface AssessmentNotesProps {
  assessmentId: number
  initialNotes?: string | null
}

export default function AssessmentNotes({ assessmentId, initialNotes }: AssessmentNotesProps) {
  const [notes, setNotes] = useState(initialNotes || '')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await assessmentsApi.updateNotes(assessmentId, notes)
      setIsEditing(false)
      toast.success('Notes saved successfully')
    } catch (error: any) {
      toast.error('Failed to save notes')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setNotes(initialNotes || '')
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Assessment Notes</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {notes ? 'Edit Notes' : 'Add Notes'}
          </button>
        </div>
        {notes ? (
          <div className="prose max-w-none">
            <p className="text-slate-700 whitespace-pre-wrap">{notes}</p>
          </div>
        ) : (
          <p className="text-slate-500 italic">No notes added yet. Click "Add Notes" to add comments or observations.</p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Assessment Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        rows={6}
        placeholder="Add notes, comments, or observations about this assessment..."
      />
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleCancel}
          className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Notes'}
        </button>
      </div>
    </div>
  )
}




