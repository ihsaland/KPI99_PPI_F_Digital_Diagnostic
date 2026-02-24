'use client'

import React, { useState } from 'react'
import { assessmentsApi } from '@/lib/api'
import { STRATEGIC_INITIATIVES, getInitiativeLabel, isStrategicInitiativeTag } from '@/lib/strategicInitiatives'
import toast from 'react-hot-toast'

interface AssessmentTagsProps {
  assessmentId: number
  initialTags?: string[] | null
}

export default function AssessmentTags({ assessmentId, initialTags }: AssessmentTagsProps) {
  const [tags, setTags] = useState<string[]>(initialTags || [])
  const [newTag, setNewTag] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()]
      handleSaveTags(updatedTags)
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove)
    handleSaveTags(updatedTags)
  }

  const handleSaveTags = async (updatedTags: string[]) => {
    setSaving(true)
    try {
      await assessmentsApi.updateTags(assessmentId, updatedTags)
      setTags(updatedTags)
      setIsEditing(false)
      toast.success('Tags updated')
    } catch (error: any) {
      toast.error('Failed to update tags')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Tags</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Strategic initiatives (optional)</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {STRATEGIC_INITIATIVES.map((init) => (
                <button
                  key={init.tag}
                  type="button"
                  onClick={() => {
                    if (tags.includes(init.tag)) return
                    handleSaveTags([...tags, init.tag])
                  }}
                  disabled={tags.includes(init.tag)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {tags.includes(init.tag) ? '✓ ' : ''}{init.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isStrategicInitiativeTag(tag) ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-700'}`}
                >
                  {isStrategicInitiativeTag(tag) ? getInitiativeLabel(tag) : tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-700 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isStrategicInitiativeTag(tag) ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-700'}`}
              >
                {isStrategicInitiativeTag(tag) ? getInitiativeLabel(tag) : tag}
              </span>
            ))
          ) : (
            <p className="text-slate-500 italic text-sm">No tags added yet</p>
          )}
        </div>
      )}
    </div>
  )
}




