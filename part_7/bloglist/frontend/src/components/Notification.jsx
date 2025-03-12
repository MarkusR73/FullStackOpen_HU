import { useNotificationValue } from '../contexts/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification || !notification.message) {
    return null
  }

  const notificationStyle =
    notification.type === 'error' ? 'error' : 'notification'

  return <div className={notificationStyle}>{notification.message}</div>
}

export default Notification
