import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { BrowserRouter, useNavigate } from 'react-router-dom'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add VITE_CLERK_PUBLISHABLE_KEY to your .env file')
}

function ClerkProviderWithRoutes({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      // Always redirect to /home after auth.
      // OnboardingGuard on /home will send new users to /onboarding automatically.
      signInFallbackRedirectUrl="/home"
      signUpFallbackRedirectUrl="/home"
    >
      {children}
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <ClerkProviderWithRoutes>
        <App />
      </ClerkProviderWithRoutes>
    </BrowserRouter>
  </Provider>
)