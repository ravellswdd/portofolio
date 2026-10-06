import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './theme/ThemeProvider.tsx'
import { LenisProvider } from './motion/LenisProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <LenisProvider>
          <App />
        </LenisProvider>
      </ThemeProvider>
    </MotionConfig>
  </StrictMode>,
)
