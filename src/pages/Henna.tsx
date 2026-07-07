import { CelebrationPage } from '../components/CelebrationPage'
import { HENNA } from '../data/sections'

export function Component() {
  return (
    <CelebrationPage
      content={HENNA}
      path="/henna"
      location="henna"
      related={[
        { label: 'חתונות', to: '/weddings' },
        { label: 'בר/בת מצווה', to: '/bar-bat-mitzvah' },
        { label: 'גלריה', to: '/gallery' },
      ]}
    />
  )
}
