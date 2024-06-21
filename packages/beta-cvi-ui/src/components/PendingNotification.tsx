import React from 'react'

const PendingNotification = () => {
  return (
    <div className="pending-spinner spinner-1">
      <svg className="pending-notification-svg">
        <circle className="move-circle" cx="10.3" cy="10.3" r="6"></circle>
      </svg>
    </div>
  )
}

export default PendingNotification
