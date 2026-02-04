import { useState, useEffect } from 'react'
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { supabase } from '../../lib/supabase'
import { LEAD_STATUSES } from '../../lib/constants'
import { KanbanColumn } from './KanbanColumn'
import { LeadCard } from './LeadCard'

export const KanbanBoard = ({ clientId, onLeadClick, refreshTrigger }) => {
  const [leads, setLeads] = useState([])
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    if (clientId) {
      fetchLeads()
    }
  }, [clientId, refreshTrigger])

  const fetchLeads = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (data) {
      setLeads(data)
    }
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const leadId = active.id
    const newStatus = over.id

    const lead = leads.find(l => l.id === leadId)
    if (!lead || lead.status === newStatus) return

    setLeads(prevLeads =>
      prevLeads.map(l =>
        l.id === leadId ? { ...l, status: newStatus } : l
      )
    )

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId)

    if (!error) {
      await supabase.from('lead_activity_log').insert({
        lead_id: leadId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        user_email: (await supabase.auth.getUser()).data.user?.email,
        action_type: 'status_changed',
        old_value: lead.status,
        new_value: newStatus,
        description: `Status gewijzigd van ${LEAD_STATUSES.find(s => s.id === lead.status)?.label} naar ${LEAD_STATUSES.find(s => s.id === newStatus)?.label}`,
      })
    } else {
      fetchLeads()
    }
  }

  const getLeadsByStatus = (statusId) => {
    return leads.filter(lead => lead.status === statusId)
  }

  const activeLead = activeId ? leads.find(lead => lead.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-2 min-w-max">
          {LEAD_STATUSES.map(status => (
            <KanbanColumn
              key={status.id}
              status={status}
              leads={getLeadsByStatus(status.id)}
              onLeadClick={onLeadClick}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeLead ? <LeadCard lead={activeLead} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
