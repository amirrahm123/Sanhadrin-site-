import { CelebrationPage } from '../components/CelebrationPage'
import { NOON_WEDDING } from '../data/sections'
import { galleryPath } from '../data/galleryData'

export function Component() {
  return (
    <CelebrationPage
      content={NOON_WEDDING}
      path="/noon-weddings"
      location="noon_weddings"
      heroSlot="noon_weddings_hero"
      introSlot="noon_weddings_intro"
      galleryLink={galleryPath('noon-weddings')}
      related={[
        { label: 'חתונות', to: '/weddings' },
        { label: 'חתונות חורף', to: '/winter-weddings' },
        { label: 'גלריה', to: '/gallery' },
      ]}
    />
  )
}
