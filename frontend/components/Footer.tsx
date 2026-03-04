export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-2">
          <p className="text-slate-600 text-sm">
            Performance failures are business risks — until they are engineered. Enhanced with AI-Augmented Performance Engineering.
          </p>
          <p className="text-slate-600 text-sm">
            <a
              href="https://kpi99.co/en/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Privacy Policy
            </a>
            {' · '}
            <a
              href="https://kpi99.co/en/cookie-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Cookie Policy
            </a>
          </p>
          <p className="text-slate-500 text-xs">
            © 2026 KPI99 LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

