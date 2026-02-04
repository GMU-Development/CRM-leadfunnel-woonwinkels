import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatCurrency } from '../../utils/helpers'
import { useAuth } from '../../contexts/AuthContext'

export const StatsBar = ({ clientId }) => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsThisMonth: 0,
    costPerLead: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    if (clientId) {
      fetchStats()
    }
  }, [clientId])

  const fetchStats = async () => {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const { data: allLeads } = await supabase
      .from('leads')
      .select('*')
      .eq('client_id', clientId)

    const { data: monthLeads } = await supabase
      .from('leads')
      .select('*')
      .eq('client_id', clientId)
      .gte('created_at', firstDayOfMonth.toISOString())

    const monthLeadsCount = monthLeads?.length || 0

    const customerLeads = allLeads?.filter(lead => lead.status === 'klant') || []
    const conversionRate = allLeads?.length > 0 ? (customerLeads.length / allLeads.length) * 100 : 0

    setStats({
      totalLeads: allLeads?.length || 0,
      leadsThisMonth: monthLeadsCount,
      costPerLead: 40,
      conversionRate: conversionRate,
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-6 w-full">
      <StatCard
        label="Totaal Leads"
        value={stats.totalLeads}
      />
      <StatCard
        label="Leads deze maand"
        value={stats.leadsThisMonth}
      />
      <StatCard
        label="Cost per Lead"
        value={formatCurrency(stats.costPerLead)}
      />
      <StatCard
        label="Conversieratio"
        value={`${stats.conversionRate.toFixed(1)}%`}
      />
    </div>
  )
}

const StatCard = ({ label, value }) => {
  return (
    <div className="card p-4 w-full">
      <div className="text-sm text-text-secondary mb-1">{label}</div>
      <div className="text-2xl font-semibold text-text-primary">{value}</div>
    </div>
  )
}
