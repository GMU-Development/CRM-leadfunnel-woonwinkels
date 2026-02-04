import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableLeadCard } from './SortableLeadCard'

export const KanbanColumn = ({ status, leads, onLeadClick }) => {
  const { setNodeRef } = useDroppable({
    id: status.id,
  })

  return (
    <div className="flex-shrink-0 w-56">
      <div className="bg-background-secondary rounded-card p-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            <h2 className="font-semibold text-text-primary text-sm">{status.label}</h2>
          </div>
          <span className="text-xs text-text-secondary bg-white px-1.5 py-0.5 rounded-full">
            {leads.length}
          </span>
        </div>

        <div ref={setNodeRef} className="min-h-[150px]">
          <SortableContext
            items={leads.map(lead => lead.id)}
            strategy={verticalListSortingStrategy}
          >
            {leads.map(lead => (
              <SortableLeadCard
                key={lead.id}
                lead={lead}
                onClick={() => onLeadClick(lead)}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  )
}
