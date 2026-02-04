import { formatDistanceToNow } from 'date-fns'

export const formatRelativeTime = (date) => {
  const distance = formatDistanceToNow(new Date(date), { addSuffix: true })
  return distance
    .replace('about ', 'ongeveer ')
    .replace('less than a minute ago', 'minder dan een minuut geleden')
    .replace('minute ago', 'minuut geleden')
    .replace('minutes ago', 'minuten geleden')
    .replace('hour ago', 'uur geleden')
    .replace('hours ago', 'uur geleden')
    .replace('day ago', 'dag geleden')
    .replace('days ago', 'dagen geleden')
    .replace('month ago', 'maand geleden')
    .replace('months ago', 'maanden geleden')
    .replace('year ago', 'jaar geleden')
    .replace('years ago', 'jaar geleden')
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('nl-NL').format(new Date(date))
}

export const getStatusColor = (statusId) => {
  const statusColors = {
    'lead_buiten_budget': '#94a3b8',
    'lead_in_budget': '#60a5fa',
    'in_contact': '#a78bfa',
    'kwalitatieve_lead': '#34d399',
    'offerte': '#fbbf24',
    'klant': '#22c55e',
    'niet_geschikt': '#ef4444'
  }
  return statusColors[statusId] || '#94a3b8'
}
