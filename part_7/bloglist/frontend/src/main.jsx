import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { NotificationProvider } from './contexts/NotificationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationProvider>
    <App />
  </NotificationProvider>
)
