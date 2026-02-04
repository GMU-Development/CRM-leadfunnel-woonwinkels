import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'

export const AdminLayout = () => {
  const { signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Geen toegang</div>
      </div>
    )
  }

  const navItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/clients', label: 'Klanten beheren' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-button flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-lg font-semibold text-text-primary">LeadFlow Admin</span>
            </div>

            <Button onClick={handleSignOut} variant="secondary">
              Uitloggen
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex gap-4 mb-6">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-4 py-2 rounded-button font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <Outlet />
      </div>
    </div>
  )
}
