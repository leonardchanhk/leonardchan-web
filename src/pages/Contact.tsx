import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, Upload, Linkedin, Facebook, X, CheckCircle, AlertCircle, Instagram } from 'lucide-react'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.1 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function Contact() {
  const { t } = useTranslation()
  useReveal()

  const [form, setForm] = useState({ name: '', email: '', company: '', enquiry: '', message: '' })
  const [cardFile, setCardFile] = useState<File | null>(null)
  const [cardPreview, setCardPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<FormState>('idle')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setCardFile(file)
    const reader = new FileReader()
    reader.onload = e => setCardPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const body = new FormData()
      Object.entries(form).forEach(([k, v]) => body.append(k, v))
      if (cardFile) body.append('businessCard', cardFile)
      const res = await fetch('/api/contact', { method: 'POST', body })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section className="relative pt-24 pb-16 bg-gray-950" aria-labelledby="contact-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label mb-3">{t('contact.hero_label')}</p>
          <h1 id="contact-heading" className="font-brand font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            {t('contact.hero_title_1')} <span className="text-blue-400">{t('contact.hero_title_2')}</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {t('contact.hero_desc')}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950" aria-label="Contact form">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3 reveal">
            {status === 'success' ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-10 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-2">{t('contact.form_success').split('!')[0]}!</h2>
                <p className="text-gray-500 dark:text-gray-400">{t('contact.form_success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-label="Contact form" className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 space-y-5">
                <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-2">{t('contact.form_submit')}</h2>

                {status === 'error' && (
                  <div role="alert" className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-3">
                    <AlertCircle size={16} /> {t('contact.form_error')}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{t('contact.form_name')} *</label>
                    <input id="name" type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-200 min-h-[44px]"
                      placeholder={t('contact.form_name')} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{t('contact.form_email')} *</label>
                    <input id="email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-200 min-h-[44px]"
                      placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{t('contact.form_subject')}</label>
                  <input id="company" type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-200 min-h-[44px]"
                    placeholder={t('contact.form_subject')} />
                </div>

                <div>
                  <label htmlFor="enquiry" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{t('contact.form_subject')} *</label>
                  <select id="enquiry" required value={form.enquiry} onChange={e => setForm(f => ({ ...f, enquiry: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-200 min-h-[44px]">
                    <option value="">Select enquiry type...</option>
                    <option value="consulting">Strategic Consulting</option>
                    <option value="speaking">Speaking Engagement</option>
                    <option value="advisory">Advisory / Board Role</option>
                    <option value="teaching">Teaching / Academic</option>
                    <option value="media">Media / Press</option>
                    <option value="collaboration">Collaboration / Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">{t('contact.form_message')} *</label>
                  <textarea id="message" required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-200 resize-none"
                    placeholder={t('contact.form_message')} />
                </div>

                {/* Business card upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    {t('contact.form_attachment')}
                  </label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => fileRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload business card image"
                    onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors min-h-[80px] flex items-center justify-center"
                  >
                    {cardPreview ? (
                      <div className="relative">
                        <img src={cardPreview} alt="Business card preview" className="max-h-24 rounded-lg mx-auto" />
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setCardFile(null); setCardPreview(null) }}
                          aria-label="Remove business card"
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        <Upload size={24} className="mx-auto mb-2" />
                        <p className="text-xs">{t('contact.form_attachment')}</p>
                        <p className="text-xs text-gray-500 mt-0.5">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                </div>

                <button type="submit" disabled={status === 'submitting'}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                  {status === 'submitting' ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('contact.form_sending')}</>
                  ) : (
                    <><Send size={16} /> {t('contact.form_submit')}</>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  {t('contact.social_desc')}
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6 reveal">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('contact.social_title')}</h3>
              <div className="space-y-3">
                <a href="https://linkedin.com/in/leonardchan" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group min-h-[52px]">
                  <Linkedin size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">LinkedIn</p>
                    <p className="text-xs text-gray-400">linkedin.com/in/leonardchan</p>
                  </div>
                </a>
                <a href="https://facebook.com/drchan" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group min-h-[52px]">
                  <Facebook size={20} className="text-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Facebook</p>
                    <p className="text-xs text-gray-400">facebook.com/drchan</p>
                  </div>
                </a>
                <a href="https://instagram.com/leonardchan" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group min-h-[52px]">
                  <Instagram size={20} className="text-pink-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">Instagram</p>
                    <p className="text-xs text-gray-400">@leonardchan</p>
                  </div>
                </a>
                <a href="https://weibo.com/leonardchan" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group min-h-[52px]">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500" fill="currentColor" aria-hidden="true">
                    <path d="M9.82 18.16c-3.43.35-6.4-1.37-6.63-3.84-.23-2.47 2.35-4.77 5.78-5.12 3.43-.35 6.4 1.37 6.63 3.84.23 2.47-2.35 4.77-5.78 5.12zm7.87-9.6c-.28-.08-.47-.14-.32-.5.31-.79.35-1.47.01-1.96-.67-.96-2.5-.91-4.6.05 0 0-.66.29-.49-.23.32-1.04.27-1.91-.23-2.41-1.12-1.12-4.1.04-6.66 2.6C3.5 8.39 2.25 10.7 2.25 12.72c0 3.73 4.79 6 9.48 6 6.14 0 10.22-3.57 10.22-6.4 0-1.71-1.44-2.68-4.26-3.76z"/>
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">微博 Weibo</p>
                    <p className="text-xs text-gray-400">@leonardchan</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t('nav.media')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('contact.social_desc')}</p>
              <a href="/media" className="btn-primary text-sm w-full justify-center">{t('nav.media')}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
