import { Badge } from '../ui/Badge'
import { formatRelativeTime } from '../../utils/helpers'

export const LeadCard = ({ lead }) => {
  return (
    <div className="card-hover p-3 mb-2">
      <div className="mb-2">
        <h3 className="font-semibold text-text-primary text-sm mb-0.5">{lead.name}</h3>
        {lead.company_name && (
          <p className="text-xs text-text-secondary">{lead.company_name}</p>
        )}
      </div>

      {(lead.source || lead.campaign) && (
        <div className="flex gap-1 mb-2 flex-wrap">
          {lead.source && (
            <Badge color="#6B7280">{lead.source}</Badge>
          )}
          {lead.campaign && (
            <Badge color="#6B7280">{lead.campaign}</Badge>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-text-secondary mt-2">
        <span>{formatRelativeTime(lead.created_at)}</span>
      </div>

      {lead.next_action && lead.next_action_date && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-start gap-1.5 text-xs">
            <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-text-primary font-medium line-clamp-1">{lead.next_action}</div>
              <div className="text-text-secondary">{new Date(lead.next_action_date).toLocaleDateString('nl-NL')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
