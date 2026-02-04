import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'

export const Header = ({ logoUrl, companyName }) => {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="h-10 w-auto" />
            ) : (
              <div className="h-10 w-10 bg-primary rounded-button flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {companyName?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-lg font-semibold text-text-primary">{companyName}</span>
          </div>

          <Button onClick={handleSignOut} variant="secondary">
            Uitloggen
          </Button>
        </div>
      </div>
    </header>
  )
}
