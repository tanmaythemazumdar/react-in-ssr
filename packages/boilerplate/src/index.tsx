import { startTransition } from 'react'
import { createRoot } from 'react-dom/client'

const App = () => (
  <h1>Welcome to Tini!!</h1>
)

const root = document.getElementById('root')

startTransition(() => {
  createRoot(root).render(
    <App />,
  )
})
