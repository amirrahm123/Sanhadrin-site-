import { CelebrationPage } from '../components/CelebrationPage'
import { WINTER_WEDDING } from '../data/sections'
import { galleryPath } from '../data/galleryData'

export function Component() {
  return (
    <CelebrationPage
      content={WINTER_WEDDING}
      path="/winter-weddings"
      location="winter_weddings"
      heroSlot="winter_weddings_hero"
      introSlot="winter_weddings_intro"
      galleryLink={galleryPath('winter-weddings')}
      related={[
        { label: 'חתונות', to: '/weddings' },
        { label: 'חתונות צהריים', to: '/noon-weddings' },
        { label: 'גלריה', to: '/gallery' },
      ]}
    />
  )
}
