import { redirect } from 'next/navigation'

/**
 * /es and /es/ redirect to root so diagnostic.kpi99.co/es is accessible (same app).
 */
export default function EsPage() {
  redirect('/')
}
