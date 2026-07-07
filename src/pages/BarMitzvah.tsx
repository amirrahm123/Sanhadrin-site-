import { CelebrationPage } from '../components/CelebrationPage'
import { BAR_MITZVAH } from '../data/sections'

export function Component() {
  return (
    <CelebrationPage
      content={BAR_MITZVAH}
      path="/bar-mitzvah"
      location="bar_mitzvah"
      related={[
        { label: 'בת מצווה', to: '/bat-mitzvah' },
        { label: 'חתונות', to: '/weddings' },
        { label: 'גלריה', to: '/gallery' },
      ]}
    />
  )
}
