import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

// Build-time static generation: vite-react-ssg pre-renders each route in
// `routes` to standalone HTML, then hydrates on the client.
export const createRoot = ViteReactSSG({ routes })
