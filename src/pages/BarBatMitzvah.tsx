import { CelebrationPage } from '../components/CelebrationPage'
import { BAR_BAT_MITZVAH } from '../data/sections'

export function Component() {
  return (
    <CelebrationPage
      content={BAR_BAT_MITZVAH}
      path="/bar-bat-mitzvah"
      location="bar_bat_mitzvah"
      related={[
        { label: 'חתונות', to: '/weddings' },
        { label: 'חינות יוקרתיות', to: '/henna' },
        { label: 'גלריה', to: '/gallery' },
      ]}
    />
  )
}
