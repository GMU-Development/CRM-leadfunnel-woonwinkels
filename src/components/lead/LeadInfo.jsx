import { useState } from 'react'
import { Input } from '../ui/Input'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { supabase } from '../../lib/supabase'

export const LeadInfo = ({ lead, onUpdate }) => {
  const [nextAction, setNextAction] = useState(lead.next_action || '')
  const [nextActionDate, setNextActionDate] = useState(lead.next_action_date || '')

  const handleNextActionUpdate = async () => {
    const { error } = await supabase
      .from('leads')
      .update({
        next_action: nextAction,
        next_action_date: nextActionDate || null,
      })
      .eq('id', lead.id)

    if (!error) {
      await supabase.from('lead_activity_log').insert({
        lead_id: lead.id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        user_email: (await supabase.auth.getUser()).data.user?.email,
        action_type: 'next_action_updated',
        description: `Volgende actie aangepast: ${nextAction}`,
      })

      onUpdate({ ...lead, next_action: nextAction, next_action_date: nextActionDate })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {lead.email && (
          <div>
            <div className="text-sm text-text-secondary mb-1">Email</div>
            <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
              {lead.email}
            </a>
          </div>
        )}

        {lead.phone && (
          <div>
            <div className="text-sm text-text-secondary mb-1">Telefoon</div>
            <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
              {lead.phone}
            </a>
          </div>
        )}

        {lead.company_name && (
          <div>
            <div className="text-sm text-text-secondary mb-1">Bedrijf</div>
            <div className="text-text-primary">{lead.company_name}</div>
          </div>
        )}

        <div>
          <div className="text-sm text-text-secondary mb-1">Datum binnenkomst</div>
          <div className="text-text-primary">{formatDate(lead.created_at)}</div>
        </div>

        {lead.budget && (
          <div>
            <div className="text-sm text-text-secondary mb-1">Budget</div>
            <div className="text-text-primary font-medium text-green-600">{formatCurrency(lead.budget)}</div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-text-primary mb-4">Volgende Actie</h3>

        <div className="space-y-3">
          <Input
            label="Actie"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            onBlur={handleNextActionUpdate}
            placeholder="Bijvoorbeeld: Terugbellen voor afspraak"
          />

          <Input
            label="Datum"
            type="date"
            value={nextActionDate}
            onChange={(e) => setNextActionDate(e.target.value)}
            onBlur={handleNextActionUpdate}
          />
        </div>
      </div>
    </div>
  )
}
