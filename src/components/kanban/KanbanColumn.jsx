import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableLeadCard } from './SortableLeadCard'

export const KanbanColumn = ({ status, leads, onLeadClick }) => {
  const { setNodeRef } = useDroppable({
    id: status.id,
  })

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-background-secondary rounded-card p-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            <h2 className="font-semibold text-text-primary">{status.label}</h2>
          </div>
          <span className="text-sm text-text-secondary bg-white px-2 py-0.5 rounded-full">
            {leads.length}
          </span>
        </div>

        <div ref={setNodeRef} className="min-h-[200px]">
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
