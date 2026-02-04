import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { formatCurrency } from '../../utils/helpers'

export const AdminDashboard = () => {
  const [clients, setClients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    const { data: clientsData } = await supabase
      .from('clients')
      .select('*')
      .order('company_name')

    if (clientsData) {
      const clientsWithStats = await Promise.all(
        clientsData.map(async (client) => {
          const { data: leads } = await supabase
            .from('leads')
            .select('*')
            .eq('client_id', client.id)

          const now = new Date()
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

          const monthLeads = leads?.filter(lead =>
            new Date(lead.created_at) >= firstDayOfMonth
          ) || []

          const { data: adSpend } = await supabase
            .from('monthly_ad_spend')
            .select('spend')
            .eq('client_id', client.id)
            .eq('month', `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`)

          const totalSpend = adSpend?.reduce((sum, item) => sum + parseFloat(item.spend), 0) || 0
          const cpl = 40

          const customerLeads = leads?.filter(lead => lead.status === 'klant') || []
          const conversionRate = leads?.length > 0 ? (customerLeads.length / leads.length) * 100 : 0

          return {
            ...client,
            totalLeads: leads?.length || 0,
            leadsThisMonth: monthLeads.length,
            cpl,
            conversionRate,
          }
        })
      )

      setClients(clientsWithStats)
    }
  }

  const filteredClients = clients.filter(client =>
    client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Klanten Overzicht</h1>
        <Button onClick={() => navigate('/admin/clients')}>
          Klanten beheren
        </Button>
      </div>

      <Input
        placeholder="Zoek klant..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-background-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Bedrijf
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Totaal Leads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Leads deze maand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                CPL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Conversie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map(client => (
              <tr
                key={client.id}
                onClick={() => navigate(`/admin/clients/${client.id}`)}
                className="hover:bg-background-secondary cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-text-primary">{client.company_name}</div>
                  <div className="text-sm text-text-secondary">{client.contact_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                  {client.totalLeads}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                  {client.leadsThisMonth}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                  {formatCurrency(client.cpl)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                  {client.conversionRate.toFixed(1)}%
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
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="text-center text-text-secondary py-12">
            Geen klanten gevonden
          </div>
        )}
      </div>
    </div>
  )
}
