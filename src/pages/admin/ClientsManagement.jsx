import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'

export const ClientsManagement = () => {
  const [clients, setClients] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    logo_url: '',
  })
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('company_name')

    if (data) {
      setClients(data)
    }
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleCreateClient = async (e) => {
    e.preventDefault()
    setLoading(true)

    const password = generatePassword()

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: newClient.email,
      password: password,
      email_confirm: true,
    })

    if (authError) {
      alert('Fout bij het aanmaken van de gebruiker: ' + authError.message)
      setLoading(false)
      return
    }

    const { error: clientError } = await supabase
      .from('clients')
      .insert({
        company_name: newClient.company_name,
        contact_name: newClient.contact_name,
        email: newClient.email,
        logo_url: newClient.logo_url || null,
      })

    if (clientError) {
      alert('Fout bij het aanmaken van de klant: ' + clientError.message)
      setLoading(false)
      return
    }

    setGeneratedPassword(password)
    fetchClients()
    setLoading(false)

    setNewClient({
      company_name: '',
      contact_name: '',
      email: '',
      logo_url: '',
    })
  }

  const handleToggleActive = async (client) => {
    const { error } = await supabase
      .from('clients')
      .update({ is_active: !client.is_active })
      .eq('id', client.id)

    if (!error) {
      fetchClients()
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setGeneratedPassword('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Klanten Beheer</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Nieuwe klant toevoegen
        </Button>
      </div>

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-background-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Bedrijf
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Contactpersoon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Acties
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map(client => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-text-primary">{client.company_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                  {client.contact_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                  {client.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    client.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.is_active ? 'Actief' : 'Inactief'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant="secondary"
                    onClick={() => handleToggleActive(client)}
                    className="text-sm"
                  >
                    {client.is_active ? 'Deactiveren' : 'Activeren'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clients.length === 0 && (
          <div className="text-center text-text-secondary py-12">
            Nog geen klanten. Voeg je eerste klant toe!
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Nieuwe klant toevoegen">
        {generatedPassword ? (
          <div className="p-6">
            <div className="mb-4">
              <div className="text-green-600 font-medium mb-2">Klant succesvol aangemaakt!</div>
              <p className="text-text-secondary mb-4">
                Bewaar het wachtwoord goed. Het wordt maar één keer getoond.
              </p>
            </div>

            <div className="card p-4 bg-background-secondary">
              <div className="text-sm text-text-secondary mb-1">Email</div>
              <div className="font-medium text-text-primary mb-4">{newClient.email}</div>

              <div className="text-sm text-text-secondary mb-1">Wachtwoord</div>
              <div className="font-mono text-lg font-bold text-primary">{generatedPassword}</div>
            </div>

            <Button onClick={closeModal} className="mt-6 w-full">
              Sluiten
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCreateClient} className="p-6 space-y-4">
            <Input
              label="Bedrijfsnaam"
              value={newClient.company_name}
              onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })}
              required
            />

            <Input
              label="Contactpersoon"
              value={newClient.contact_name}
              onChange={(e) => setNewClient({ ...newClient, contact_name: e.target.value })}
              required
            />

            <Input
              label="Email"
              type="email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              required
            />

            <Input
              label="Logo URL (optioneel)"
              value={newClient.logo_url}
              onChange={(e) => setNewClient({ ...newClient, logo_url: e.target.value })}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Aanmaken...' : 'Klant aanmaken'}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  )
}
