export const EmailTab = ({ lead }) => {
  if (!lead.email_sent_at) {
    return (
      <div className="text-center text-text-secondary py-8">
        Nog geen email verzonden naar deze lead
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="text-sm text-text-secondary mb-1">Email verzonden op</div>
        <div className="text-text-primary">
          {new Date(lead.email_sent_at).toLocaleString('nl-NL')}
        </div>
      </div>

      {lead.email_template_used && (
        <div className="card p-4">
          <div className="text-sm font-medium text-text-primary mb-3">Template gebruikt</div>
          <div className="text-sm text-text-secondary mb-4">{lead.email_template_used}</div>

          <div className="border border-gray-200 rounded-button overflow-hidden">
            <div className="bg-background-secondary p-2 border-b border-gray-200">
              <div className="text-xs text-text-secondary">Email Preview</div>
            </div>
            <div className="p-4 bg-white max-h-96 overflow-y-auto">
              <div className="text-sm text-text-secondary">
                Voorbeeldweergave niet beschikbaar. Template naam: {lead.email_template_used}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
