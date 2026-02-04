export const Card = ({ children, onClick, className = '', hover = false }) => {
  const hoverClasses = hover ? 'card-hover' : 'card'

  return (
    <div
      onClick={onClick}
      className={`${hoverClasses} ${className}`}
    >
      {children}
    </div>
  )
}
