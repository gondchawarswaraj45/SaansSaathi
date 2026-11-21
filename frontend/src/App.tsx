import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import { FloatingChatButton } from './components/chatbot/FloatingChatButton'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#2D6A4F', secondary: '#fff' },
          },
        }}
      />
      <AppRoutes />
      <FloatingChatButton />
    </BrowserRouter>
  )
}

export default App
