import { redirect } from 'next/navigation'

/**
 * /en and /en/ redirect to root so diagnostic.kpi99.co/en is accessible (same app, English-only).
 */
export default function EnPage() {
  redirect('/')
}
