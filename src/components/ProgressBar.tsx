import React from 'react'

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
      <div
        className="h-full rounded transition-all"
        style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#4f46e5,#a78bfa)' }}
      />
    </div>
  )
}

export default ProgressBar