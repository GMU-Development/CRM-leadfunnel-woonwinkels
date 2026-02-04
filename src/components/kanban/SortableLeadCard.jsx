import { useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { LeadCard } from './LeadCard'

export const SortableLeadCard = ({ lead, onClick }) => {
  const pointerStartPos = useRef(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handlePointerDown = (e) => {
    pointerStartPos.current = { x: e.clientX, y: e.clientY }
    listeners?.onPointerDown?.(e)
  }

  const handlePointerUp = (e) => {
    if (pointerStartPos.current) {
      const dx = Math.abs(e.clientX - pointerStartPos.current.x)
      const dy = Math.abs(e.clientY - pointerStartPos.current.y)
      if (dx < 5 && dy < 5) {
        onClick?.()
      }
    }
    pointerStartPos.current = null
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <LeadCard lead={lead} />
    </div>
  )
}
