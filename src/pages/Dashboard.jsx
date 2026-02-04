import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Header } from '../components/dashboard/Header'
import { StatsBar } from '../components/dashboard/StatsBar'
import { KanbanBoard } from '../components/kanban/KanbanBoard'
import { LeadDetailModal } from '../components/lead/LeadDetailModal'
import { supabase } from '../lib/supabase'
import { LEAD_STATUSES } from '../lib/constants'

export const Dashboard = () => {
  const { clientData } = useAuth()
  const [selectedLead, setSelectedLead] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Laden...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header logoUrl={clientData.logo_url} companyName={clientData.company_name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsBar clientId={clientData.id} />
        <KanbanBoard
          clientId={clientData.id}
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
    </div>
  )
}
