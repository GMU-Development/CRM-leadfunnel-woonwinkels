import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatRelativeTime } from '../../utils/helpers'

export const ActivityTab = ({ leadId }) => {
  const [activities, setActivities] = useState([])

  useEffect(() => {
    fetchActivities()
  }, [leadId])

  const fetchActivities = async () => {
    const { data } = await supabase
      .from('lead_activity_log')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (data) {
      setActivities(data)
    }
  }

  const getActivityIcon = (actionType) => {
    const icons = {
      status_changed: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      note_added: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      task_created: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      task_completed: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      next_action_updated: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }

    return icons[actionType] || icons.note_added
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-background-secondary flex items-center justify-center text-text-secondary flex-shrink-0">
              {getActivityIcon(activity.action_type)}
            </div>
            {index < activities.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mt-2" />
            )}
          </div>

          <div className="flex-1 pb-6">
            <div className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm font-medium text-text-primary">
                  {activity.description}
                </div>
                <div className="text-xs text-text-secondary whitespace-nowrap ml-4">
                  {formatRelativeTime(activity.created_at)}
                </div>
              </div>
              <div className="text-sm text-text-secondary">
                {activity.user_email}
              </div>
            </div>
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="text-center text-text-secondary py-8">
          Nog geen activiteiten geregistreerd
        </div>
      )}
    </div>
  )
}
