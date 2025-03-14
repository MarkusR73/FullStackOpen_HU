import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { UserProvider } from './contexts/UserContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </UserProvider>
  </QueryClientProvider>
)
