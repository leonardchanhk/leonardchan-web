import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Send, CheckCircle } from 'lucide-react'

export default function AdminLogin() {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) setStep('otp')
      else setError('Email not authorised. Please contact the site administrator.')
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      if (res.ok) navigate('/admin')
      else setError('Invalid or expired code. Please try again.')
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4" style={{ paddingTop: '4rem' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-blue-400" />
          </div>
          <h1 className="font-brand font-bold text-white text-2xl">CMS Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Leonard Chan — Official Website</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          {step === 'email' ? (
            <form onSubmit={sendOtp} aria-label="Admin login form">
              <label htmlFor="admin-email" className="block text-xs font-semibold text-gray-400 mb-2">Email Address</label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@leonardchan.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none mb-4 min-h-[44px]"
              />
              {error && <p role="alert" className="text-red-400 text-xs mb-3">{error}</p>}
              <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={16} /> Send Login Code</>}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} aria-label="OTP verification form">
              <div className="flex items-center gap-2 mb-4 text-green-400 text-sm">
                <CheckCircle size={16} /> Code sent to {email}
              </div>
              <label htmlFor="otp-code" className="block text-xs font-semibold text-gray-400 mb-2">6-Digit Code</label>
              <input
                id="otp-code"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white text-center tracking-widest text-xl focus:ring-2 focus:ring-blue-500 outline-none mb-4 min-h-[44px]"
              />
              {error && <p role="alert" className="text-red-400 text-xs mb-3">{error}</p>}
              <button type="submit" disabled={loading || otp.length !== 6}
                className="btn-primary w-full justify-center disabled:opacity-50">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify & Login'}
              </button>
              <button type="button" onClick={() => { setStep('email'); setOtp(''); setError('') }}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-300 mt-3 transition-colors">
                ← Use a different email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
