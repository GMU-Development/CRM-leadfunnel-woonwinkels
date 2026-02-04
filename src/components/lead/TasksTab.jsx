import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { formatDate } from '../../utils/helpers'

export const TasksTab = ({ leadId }) => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [newTaskDate, setNewTaskDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [leadId])

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('lead_tasks')
      .select('*')
      .eq('lead_id', leadId)
      .order('is_completed', { ascending: true })
      .order('due_date', { ascending: true })

    if (data) {
      setTasks(data)
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    setLoading(true)

    const user = (await supabase.auth.getUser()).data.user

    const { error } = await supabase.from('lead_tasks').insert({
      lead_id: leadId,
      user_id: user?.id,
      title: newTask,
      due_date: newTaskDate || null,
    })

    if (!error) {
      await supabase.from('lead_activity_log').insert({
        lead_id: leadId,
        user_id: user?.id,
        user_email: user?.email,
        action_type: 'task_created',
        description: `Taak aangemaakt: ${newTask}`,
      })

      setNewTask('')
      setNewTaskDate('')
      fetchTasks()
    }

    setLoading(false)
  }

  const handleToggleTask = async (task) => {
    const isCompleted = !task.is_completed
    const user = (await supabase.auth.getUser()).data.user

    const { error } = await supabase
      .from('lead_tasks')
      .update({
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      })
      .eq('id', task.id)

    if (!error) {
      await supabase.from('lead_activity_log').insert({
        lead_id: leadId,
        user_id: user?.id,
        user_email: user?.email,
        action_type: isCompleted ? 'task_completed' : 'task_reopened',
        description: `Taak ${isCompleted ? 'afgerond' : 'heropend'}: ${task.title}`,
      })

      fetchTasks()
    }
  }

  const incompleteTasks = tasks.filter(t => !t.is_completed)
  const completedTasks = tasks.filter(t => t.is_completed)

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddTask} className="space-y-3">
        <Input
          label="Nieuwe taak toevoegen"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Bijvoorbeeld: Offerte opstellen"
        />
        <Input
          label="Vervaldatum (optioneel)"
          type="date"
          value={newTaskDate}
          onChange={(e) => setNewTaskDate(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Toevoegen...' : 'Taak toevoegen'}
        </Button>
      </form>

      <div className="space-y-3">
        {incompleteTasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={() => handleToggleTask(task)} />
        ))}

        {completedTasks.length > 0 && (
          <>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-sm font-medium text-text-secondary mb-3">Afgerond</h4>
            </div>
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={() => handleToggleTask(task)} />
            ))}
          </>
        )}

        {tasks.length === 0 && (
          <div className="text-center text-text-secondary py-8">
            Nog geen taken. Voeg je eerste taak toe!
          </div>
        )}
      </div>
    </div>
  )
}

const TaskItem = ({ task, onToggle }) => {
  return (
    <div className={`card p-4 ${task.is_completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={onToggle}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        />
        <div className="flex-1">
          <div className={`text-text-primary ${task.is_completed ? 'line-through' : ''}`}>
            {task.title}
          </div>
          {task.due_date && (
            <div className="text-sm text-text-secondary mt-1">
              Vervaldatum: {formatDate(task.due_date)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
