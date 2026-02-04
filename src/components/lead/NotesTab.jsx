import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { formatRelativeTime } from '../../utils/helpers'

export const NotesTab = ({ leadId }) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [leadId])

  const fetchNotes = async () => {
    const { data } = await supabase
      .from('lead_notes')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (data) {
      setNotes(data)
    }
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setLoading(true)

    const user = (await supabase.auth.getUser()).data.user

    const { error } = await supabase.from('lead_notes').insert({
      lead_id: leadId,
      user_id: user?.id,
      user_email: user?.email,
      content: newNote,
    })

    if (!error) {
      await supabase.from('lead_activity_log').insert({
        lead_id: leadId,
        user_id: user?.id,
        user_email: user?.email,
        action_type: 'note_added',
        description: 'Notitie toegevoegd',
      })

      setNewNote('')
      fetchNotes()
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddNote}>
        <Textarea
          label="Nieuwe notitie toevoegen"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Typ hier je notitie..."
          rows={3}
        />
        <Button type="submit" disabled={loading} className="mt-3">
          {loading ? 'Toevoegen...' : 'Notitie toevoegen'}
        </Button>
      </form>

      <div className="space-y-4">
        {notes.map(note => (
          <div key={note.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-text-secondary">
                {note.user_email}
              </div>
              <div className="text-xs text-text-secondary">
                {formatRelativeTime(note.created_at)}
              </div>
            </div>
            <p className="text-text-primary whitespace-pre-wrap">{note.content}</p>
          </div>
        ))}

        {notes.length === 0 && (
          <div className="text-center text-text-secondary py-8">
            Nog geen notities. Voeg je eerste notitie toe!
          </div>
        )}
      </div>
    </div>
  )
}
