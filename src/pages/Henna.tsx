import { CelebrationPage } from '../components/CelebrationPage'
import { HENNA } from '../data/sections'

export function Component() {
  return (
    <CelebrationPage
      content={HENNA}
      location="henna"
      related={[
        { label: 'חתונות', to: '/weddings' },
        { label: 'בר מצווה', to: '/bar-mitzvah' },
        { label: 'בת מצווה', to: '/bat-mitzvah' },
      ]}
    />
  )
}
