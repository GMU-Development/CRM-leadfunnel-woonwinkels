import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Badge } from '../ui/Badge'
import { LEAD_STATUSES } from '../../lib/constants'
import { getStatusColor } from '../../utils/helpers'
import { LeadInfo } from './LeadInfo'
import { NotesTab } from './NotesTab'
import { TasksTab } from './TasksTab'
import { ActivityTab } from './ActivityTab'
import { EmailTab } from './EmailTab'

export const LeadDetailModal = ({ lead, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('notes')

  if (!lead) return null

  const tabs = [
    { id: 'notes', label: 'Notities' },
    { id: 'tasks', label: 'Taken' },
    { id: 'activity', label: 'Activiteit' },
    { id: 'email', label: 'Email' },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-3">{lead.name}</h2>

          <div className="flex items-center gap-2 mb-4">
            <select
              value={lead.status}
              onChange={(e) => onUpdate({ ...lead, status: e.target.value })}
              className="px-3 py-1.5 border border-gray-300 rounded-button text-sm font-medium"
              style={{
                backgroundColor: `${getStatusColor(lead.status)}20`,
                color: getStatusColor(lead.status),
              }}
            >
              {LEAD_STATUSES.map(status => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>

            {lead.source && <Badge color="#6B7280">{lead.source}</Badge>}
            {lead.campaign && <Badge color="#6B7280">{lead.campaign}</Badge>}
          </div>

          <LeadInfo lead={lead} onUpdate={onUpdate} />
        </div>

        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {activeTab === 'notes' && <NotesTab leadId={lead.id} />}
          {activeTab === 'tasks' && <TasksTab leadId={lead.id} />}
          {activeTab === 'activity' && <ActivityTab leadId={lead.id} />}
          {activeTab === 'email' && <EmailTab lead={lead} />}
        </div>
      </div>
    </Modal>
  )
}
