import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Header } from '../../components/dashboard/Header'
import { StatsBar } from '../../components/dashboard/StatsBar'
import { KanbanBoard } from '../../components/kanban/KanbanBoard'
import { LeadDetailModal } from '../../components/lead/LeadDetailModal'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { LEAD_STATUSES } from '../../lib/constants'

export const ClientView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isAdSpendModalOpen, setIsAdSpendModalOpen] = useState(false)
  const [adSpendData, setAdSpendData] = useState({
    month: new Date().toISOString().slice(0, 7),
    spend: '',
    platform: 'Meta Ads',
  })

  useEffect(() => {
    fetchClient()
  }, [id])

  const fetchClient = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setClient(data)
    }
  }

  const handleLeadClick = (lead) => {
    setSelectedLead(lead)
  }

  const handleLeadUpdate = async (updatedLead) => {
    if (updatedLead.status !== selectedLead.status) {
      const { error } = await supabase
        .from('leads')
        .update({ status: updatedLead.status })
        .eq('id', updatedLead.id)

      if (!error) {
        const user = (await supabase.auth.getUser()).data.user

        await supabase.from('lead_activity_log').insert({
          lead_id: updatedLead.id,
          user_id: user?.id,
          user_email: user?.email,
          action_type: 'status_changed',
          old_value: selectedLead.status,
          new_value: updatedLead.status,
          description: `Status gewijzigd van ${LEAD_STATUSES.find(s => s.id === selectedLead.status)?.label} naar ${LEAD_STATUSES.find(s => s.id === updatedLead.status)?.label}`,
        })

        setRefreshTrigger(prev => prev + 1)
      }
    }

    setSelectedLead(updatedLead)
  }

  const handleModalClose = () => {
    setSelectedLead(null)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleAddAdSpend = async (e) => {
    e.preventDefault()

    const monthDate = `${adSpendData.month}-01`

    const { error } = await supabase
      .from('monthly_ad_spend')
      .upsert({
        client_id: id,
        month: monthDate,
        spend: parseFloat(adSpendData.spend),
        platform: adSpendData.platform,
      }, {
        onConflict: 'client_id,month,platform'
      })

    if (!error) {
      setIsAdSpendModalOpen(false)
      setAdSpendData({
        month: new Date().toISOString().slice(0, 7),
        spend: '',
        platform: 'Meta Ads',
      })
      setRefreshTrigger(prev => prev + 1)
    }
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Laden...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header logoUrl={client.logo_url} companyName={client.company_name} />

      <div className="bg-blue-50 border-b border-blue-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-800 font-medium">
              Je bekijkt als: {client.company_name}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsAdSpendModalOpen(true)}>
              Ad Spend invoeren
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin')}>
              Terug naar admin
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsBar clientId={client.id} />
        <KanbanBoard
          clientId={client.id}
          onLeadClick={handleLeadClick}
          refreshTrigger={refreshTrigger}
        />
      </main>

      <LeadDetailModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={handleModalClose}
        onUpdate={handleLeadUpdate}
      />

      <Modal
        isOpen={isAdSpendModalOpen}
        onClose={() => setIsAdSpendModalOpen(false)}
        title="Ad Spend invoeren"
      >
        <form onSubmit={handleAddAdSpend} className="p-6 space-y-4">
          <Input
            label="Maand"
            type="month"
            value={adSpendData.month}
            onChange={(e) => setAdSpendData({ ...adSpendData, month: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">
              Platform <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={adSpendData.platform}
              onChange={(e) => setAdSpendData({ ...adSpendData, platform: e.target.value })}
              className="input-field"
              required
            >
              <option value="Meta Ads">Meta Ads</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Totaal">Totaal</option>
            </select>
          </div>

          <Input
            label="Bedrag (€)"
            type="number"
            step="0.01"
            value={adSpendData.spend}
            onChange={(e) => setAdSpendData({ ...adSpendData, spend: e.target.value })}
            required
          />

          <Button type="submit" className="w-full">
            Opslaan
          </Button>
        </form>
      </Modal>
    </div>
  )
}
