import { CelebrationPage } from '../components/CelebrationPage'
import { BAT_MITZVAH } from '../data/sections'

export function Component() {
  return (
    <CelebrationPage
      content={BAT_MITZVAH}
      location="bat_mitzvah"
      related={[
        { label: 'בר מצווה', to: '/bar-mitzvah' },
        { label: 'חתונות', to: '/weddings' },
        { label: 'גלריה', to: '/gallery' },
      ]}
    />
  )
}
