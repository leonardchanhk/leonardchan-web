import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Mic, FolderOpen, Building2,
  MessageSquare, Settings, LogOut, Menu, X, Plus, Edit, Trash2,
  Eye, Mail
} from 'lucide-react'

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'articles', label: 'Articles', icon: FileText },
  { key: 'speaking', label: 'Speaking', icon: Mic },
  { key: 'projects', label: 'Projects', icon: FolderOpen },
  { key: 'organisations', label: 'Organisations', icon: Building2 },
  { key: 'contacts', label: 'Contact Submissions', icon: MessageSquare },
  { key: 'settings', label: 'Settings', icon: Settings },
]

function DashboardPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Articles', value: '50+', icon: FileText, color: 'text-blue-600' },
          { label: 'Page Views (30d)', value: '—', icon: Eye, color: 'text-blue-500' },
          { label: 'Contact Submissions', value: '—', icon: Mail, color: 'text-green-500' },
          { label: 'Speaking Enquiries', value: '—', icon: Mic, color: 'text-purple-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <s.icon size={20} className={`${s.color} mb-2`} />
            <div className="font-bold text-2xl text-gray-900 dark:text-white">{s.value}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary text-sm"><Plus size={14} /> New Article</button>
          <button className="btn-outline text-sm"><Plus size={14} /> New Speaking Topic</button>
          <button className="btn-outline text-sm"><Plus size={14} /> New Project</button>
        </div>
      </div>
    </div>
  )
}

function ArticlesPanel() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/articles').then(r => r.json()).then(d => { setArticles(d.articles || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Articles</h2>
        <button className="btn-primary text-sm"><Plus size={14} /> New Article</button>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center border border-gray-200 dark:border-gray-700">
          <FileText size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No articles yet. Add your first article.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map((a: any) => (
            <div key={a.id} className="bg-white dark:bg-gray-800 rounded-xl px-5 py-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{a.title_en}</p>
                <p className="text-xs text-gray-400">{a.category} · {a.published_at}</p>
              </div>
              <div className="flex items-center gap-2">
                <button aria-label="Edit" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 transition-colors min-h-[36px]"><Edit size={14} /></button>
                <button aria-label="Delete" className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors min-h-[36px]"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ContactsPanel() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/contact').then(r => r.json()).then(d => { setContacts(d.submissions || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Submissions</h2>
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading submissions...</div>
      ) : contacts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center border border-gray-200 dark:border-gray-700">
          <MessageSquare size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No contact submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c: any) => (
            <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.email} · {c.company}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 rounded-full">{c.enquiry_type}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{c.message}</p>
              <p className="text-xs text-gray-400 mt-2">{c.created_at}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SettingsPanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Site Title</label>
          <input type="text" defaultValue="Leonard Chan, MH — Official Website"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[44px]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Contact Email</label>
          <input type="email" defaultValue="contact@leonardchan.com"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[44px]" />
        </div>
        <button className="btn-primary text-sm">Save Settings</button>
      </div>
    </div>
  )
}

export default function Admin() {
  const [section, setSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    navigate('/admin/login')
  }

  const renderSection = () => {
    switch (section) {
      case 'dashboard': return <DashboardPanel />
      case 'articles': return <ArticlesPanel />
      case 'contacts': return <ContactsPanel />
      case 'settings': return <SettingsPanel />
      default: return (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-semibold mb-2">{NAV.find(n => n.key === section)?.label}</p>
          <p className="text-sm">This section is coming soon.</p>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex" style={{ paddingTop: '4rem' }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
        style={{ paddingTop: '4rem' }}
        aria-label="CMS navigation"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <p className="font-bold text-gray-900 dark:text-white text-sm">CMS Admin</p>
            <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          <nav>
            {NAV.map(item => (
              <button
                key={item.key}
                onClick={() => { setSection(item.key); setSidebarOpen(false) }}
                aria-current={section === item.key ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 min-h-[44px] ${
                  section === item.key
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors min-h-[44px]">
              <Eye size={16} /> View Website
            </Link>
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors min-h-[44px]">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"
            className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <Menu size={18} />
          </button>
          <p className="font-bold text-gray-900 dark:text-white">CMS Admin</p>
        </div>
        <div className="max-w-5xl">
          {renderSection()}
        </div>
      </main>
    </div>
  )
}
