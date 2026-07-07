import { Head } from 'vite-react-ssg'
import { PageHero } from '../components/PageHero'
import { Button } from '../components/ui/Button'

export function Component() {
  return (
    <>
      <Head>
        <title>הדף לא נמצא | אחוזת סנדרין</title>
      </Head>
      <PageHero
        title="הדף לא נמצא"
        subtitle="נראה שהעמוד שחיפשתם אינו קיים. הנה הדרך חזרה אל האחוזה."
        breadcrumbs={[{ label: '404' }]}
      />
      <section className="bg-cream px-5 py-20 text-center sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6">
          <p className="font-serif text-6xl text-gold">404</p>
          <Button as="link" to="/" variant="primary" size="lg">
            חזרה לעמוד הבית
          </Button>
        </div>
      </section>
    </>
  )
}
