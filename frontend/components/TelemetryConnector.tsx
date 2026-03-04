'use client'

import { useState, useCallback, useEffect } from 'react'
import { telemetryApi, type TelemetryUploadSummary } from '@/lib/api'
import toast from 'react-hot-toast'

interface TelemetryConnectorProps {
  assessmentId: number
  onUploadComplete?: () => void
}

const MAX_CSV_MB = 10
const ACCEPT = '.csv'

export default function TelemetryConnector({ assessmentId, onUploadComplete }: TelemetryConnectorProps) {
  const [uploads, setUploads] = useState<TelemetryUploadSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<Record<string, unknown>[] | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const fetchUploads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await telemetryApi.list(assessmentId)
      setUploads(Array.isArray(res.data) ? res.data : [])
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e
        ? (e as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : null
      toast.error(msg || 'Failed to load telemetry uploads')
    } finally {
      setLoading(false)
    }
  }, [assessmentId])

  useEffect(() => {
    fetchUploads()
  }, [fetchUploads])

  const loadDetail = async (uploadId: number) => {
    if (expandedId === uploadId && detail !== null) {
      setExpandedId(null)
      setDetail(null)
      return
    }
    setLoadingDetail(true)
    try {
      const res = await telemetryApi.get(assessmentId, uploadId)
      const data = (res.data as { parsed_data?: Record<string, unknown>[] })?.parsed_data ?? null
      setDetail(Array.isArray(data) ? data : null)
      setExpandedId(uploadId)
    } catch {
      toast.error('Failed to load upload details')
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleFile = async (file: File | null) => {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }
    if (file.size > MAX_CSV_MB * 1024 * 1024) {
      toast.error(`File must be under ${MAX_CSV_MB} MB`)
      return
    }
    setUploading(true)
    try {
      await telemetryApi.uploadCsv(assessmentId, file)
      toast.success(`Uploaded ${file.name}`)
      await fetchUploads()
      onUploadComplete?.()
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e
        ? (e as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : null
      toast.error(msg || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => setDragActive(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleDelete = async (uploadId: number) => {
    try {
      await telemetryApi.delete(assessmentId, uploadId)
      toast.success('Telemetry upload removed')
      await fetchUploads()
      if (expandedId === uploadId) {
        setExpandedId(null)
        setDetail(null)
      }
    } catch {
      toast.error('Failed to delete upload')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Optional telemetry</h2>
      <p className="text-sm text-slate-600 mb-4">
        Upload CSV telemetry (metrics, performance data) to attach to this assessment. Data is stored for display and future analytics; it does not change PPI scores.
      </p>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50'}
        `}
      >
        <input
          type="file"
          accept={ACCEPT}
          onChange={handleInputChange}
          disabled={uploading}
          className="hidden"
          id="telemetry-csv-input"
        />
        <label htmlFor="telemetry-csv-input" className="cursor-pointer block">
          <span className="text-slate-500 block mb-2">
            {uploading ? 'Uploading…' : 'Drop a CSV here or click to browse'}
          </span>
          <span className="text-xs text-slate-400 block">
            Max {MAX_CSV_MB} MB, UTF-8. Columns are auto-detected.
          </span>
        </label>
      </div>

      <div className="mt-4">
        {loading ? (
          <p className="text-sm text-slate-500">Loading uploads…</p>
        ) : uploads.length === 0 ? (
          <p className="text-sm text-slate-500">No telemetry files uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {uploads.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => loadDetail(u.id)}
                    className="text-left font-medium text-slate-900 truncate block hover:underline"
                  >
                    {u.filename}
                  </button>
                  <p className="text-xs text-slate-500">
                    {u.row_count} rows
                    {u.columns?.length ? ` · ${u.columns.length} columns` : ''}
                    {u.created_at ? ` · ${new Date(u.created_at).toLocaleDateString()}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(u.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {expandedId !== null && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 overflow-x-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Sample rows</span>
              <button
                type="button"
                onClick={() => { setExpandedId(null); setDetail(null) }}
                className="text-slate-500 hover:text-slate-700 text-sm"
              >
                Close
              </button>
            </div>
            {loadingDetail ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : detail && detail.length > 0 ? (
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    {Object.keys(detail[0]).map((k) => (
                      <th key={k} className="text-left py-2 px-2 font-medium text-slate-700">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detail.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="py-1 px-2 text-slate-600">{String(v ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-slate-500">No sample data.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
