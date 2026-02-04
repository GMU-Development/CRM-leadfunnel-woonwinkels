import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [waitingForRole, setWaitingForRole] = useState(false)
  const { signIn, signUp, user, isAdmin, roleChecked } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (waitingForRole && user && roleChecked) {
      if (isAdmin) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    }
  }, [waitingForRole, user, isAdmin, roleChecked, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (isRegistering) {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message || 'Registratie mislukt')
        setLoading(false)
      } else {
        setSuccess('Account aangemaakt! Je kunt nu inloggen.')
        setIsRegistering(false)
        setLoading(false)
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        setError('Onjuiste inloggegevens')
        setLoading(false)
      } else {
        setWaitingForRole(true)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">LeadFlow</h1>
          <p className="text-text-secondary mt-2">Mini-CRM voor Lead Management</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="naam@bedrijf.nl"
              required
            />

            <Input
              label="Wachtwoord"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-button">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-button">
                {success}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading
                ? (isRegistering ? 'Registreren...' : 'Inloggen...')
                : (isRegistering ? 'Registreren' : 'Inloggen')}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering)
                setError('')
                setSuccess('')
              }}
              className="text-sm text-primary hover:text-primary-hover transition-colors"
            >
              {isRegistering ? 'Heb je al een account? Inloggen' : 'Nog geen account? Registreren'}
            </button>
            {!isRegistering && (
              <div>
                <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Wachtwoord vergeten?
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
