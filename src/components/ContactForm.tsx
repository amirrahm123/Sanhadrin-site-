import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Star,
  Instagram,
  Facebook,
  Check,
  CalendarHeart,
} from 'lucide-react'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { PhoneLink, WhatsAppLink } from './ui/TrackedLinks'
import { CONTACT, CONTACT_SECTION, EVENT_TYPES } from '../data/sections'
import { SITE } from '../data/site'
import { track } from '../lib/track'

type FormState = {
  name: string
  phone: string
  eventType: string
  date: string
  guests: string
  message: string
}

type Errors = Partial<Record<keyof FormState, string>>

const empty: FormState = {
  name: '',
  phone: '',
  eventType: '',
  date: '',
  guests: '',
  message: '',
}

export function ContactForm() {
  const reduce = useReducedMotion()
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  // Honeypot: real users never fill this; bots do → silently drop.
  const honeypot = useRef<HTMLInputElement>(null)

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const next: Errors = {}
    if (!form.name.trim()) next.name = 'נא למלא שם מלא'
    if (!/^[0-9+\-\s()]{7,}$/.test(form.phone.trim())) next.phone = 'נא להזין מספר טלפון תקין'
    if (!form.eventType) next.eventType = 'נא לבחור סוג אירוע'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (honeypot.current?.value) return // bot

    // Fire the tracking event on submit — works before GTM's real id is live.
    track('form_submit', { event_type: form.eventType })

    setStatus('submitting')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: SITE.web3formsKey,
          subject: 'פנייה חדשה מאתר אחוזת סנדרין',
          from_name: 'אתר אחוזת סנדרין',
          name: form.name,
          phone: form.phone,
          event_type: form.eventType,
          date: form.date,
          guests: form.guests,
          message: form.message,
          botcheck: false,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        setSubmitted(true)
        setStatus('idle')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const fieldCls =
    'w-full rounded-xl border border-cream/20 bg-cream/5 px-4 py-3 text-cream placeholder:text-cream/40 outline-none transition focus:border-gold focus:bg-cream/10 focus:ring-1 focus:ring-gold/50'
  const labelCls = 'mb-1.5 block text-sm font-medium text-cream/80'
  const errCls = 'mt-1 text-xs text-gold-soft'

  return (
    <Section id="contact" dark grain>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Left: form / success */}
        <Reveal>
          <span className="eyebrow">{CONTACT_SECTION.eyebrow}</span>
          <h2 className="mt-4 text-3xl leading-tight text-cream md:text-4xl lg:text-5xl">
            {CONTACT_SECTION.title}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-cream/70 md:text-lg">
            {CONTACT_SECTION.subtitle}
          </p>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center gap-4 rounded-2xl border border-gold/30 bg-emerald/40 px-6 py-12 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-emerald-deep">
                    <Check size={32} strokeWidth={2.5} />
                  </span>
                  <h3 className="text-2xl text-cream">{CONTACT_SECTION.successTitle}</h3>
                  <p className="max-w-sm text-cream/75">{CONTACT_SECTION.successBody}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(empty)
                      setSubmitted(false)
                    }}
                    className="mt-2 text-sm font-medium text-gold-soft underline-offset-4 hover:underline"
                  >
                    שליחת פנייה נוספת
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  noValidate
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                >
                  {/* Honeypot — visually hidden, off the tab order */}
                  <input
                    ref={honeypot}
                    type="text"
                    name="botcheck"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />

                  <div className="sm:col-span-1">
                    <label className={labelCls} htmlFor="name">
                      שם מלא
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={fieldCls}
                      placeholder="ישראל ישראלי"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className={errCls}>{errors.name}</p>}
                  </div>

                  <div className="sm:col-span-1">
                    <label className={labelCls} htmlFor="phone">
                      טלפון
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className={fieldCls}
                      placeholder="050-0000000"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && <p className={errCls}>{errors.phone}</p>}
                  </div>

                  <div className="sm:col-span-1">
                    <label className={labelCls} htmlFor="eventType">
                      סוג אירוע
                    </label>
                    <select
                      id="eventType"
                      value={form.eventType}
                      onChange={(e) => update('eventType', e.target.value)}
                      className={`${fieldCls} appearance-none`}
                      aria-invalid={!!errors.eventType}
                    >
                      <option value="" disabled className="text-ink">
                        בחירת סוג אירוע
                      </option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t} className="text-ink">
                          {t}
                        </option>
                      ))}
                    </select>
                    {errors.eventType && <p className={errCls}>{errors.eventType}</p>}
                  </div>

                  <div className="sm:col-span-1">
                    <label className={labelCls} htmlFor="date">
                      תאריך מבוקש
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={form.date}
                      onChange={(e) => update('date', e.target.value)}
                      className={`${fieldCls} [color-scheme:dark]`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="guests">
                      מספר אורחים
                    </label>
                    <input
                      id="guests"
                      type="number"
                      min={0}
                      value={form.guests}
                      onChange={(e) => update('guests', e.target.value)}
                      className={fieldCls}
                      placeholder="לדוגמה: 350"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="message">
                      הודעה
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      className={`${fieldCls} resize-none`}
                      placeholder="ספרו לנו על האירוע שאתם חולמים עליו..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="sm:col-span-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-cream">
                      אירעה תקלה בשליחת הטופס. אפשר להתקשר אלינו או לשלוח הודעת וואטסאפ ונחזור אליכם.
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={status === 'submitting'}
                      className="w-full bg-gold text-emerald-deep hover:bg-gold-soft"
                    >
                      <CalendarHeart size={18} />
                      {status === 'submitting' ? 'שולח…' : 'שליחת פנייה'}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Right: contact details + hours + map */}
        <Reveal delay={0.15} className="flex flex-col gap-6">
          <div className="rounded-2xl border border-cream/10 bg-cream/5 p-6 md:p-7">
            <h3 className="text-xl text-cream">פרטי התקשרות</h3>
            <span className="mt-3 mb-5 block h-px w-16 bg-gold/50" />
            <ul className="flex flex-col gap-4 text-cream/85">
              <li>
                <PhoneLink location="contact_page" className="flex items-center gap-3 hover:text-gold">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Phone size={18} />
                  </span>
                  <span dir="ltr" className="text-lg">
                    {CONTACT.phone}
                  </span>
                </PhoneLink>
              </li>
              <li>
                <WhatsAppLink
                  location="contact_page"
                  ariaLabel="שליחת הודעת וואטסאפ"
                  className="flex items-center gap-3 hover:text-gold"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <MessageCircle size={18} />
                  </span>
                  <span>שיחה בוואטסאפ</span>
                </WhatsAppLink>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <MapPin size={18} />
                </span>
                <span className="pt-2">{CONTACT.addressFull}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Clock size={18} />
                </span>
                <div className="pt-1.5">
                  <ul className="flex flex-col gap-0.5 text-sm">
                    {CONTACT.hours.map((h) => (
                      <li key={h.days} className="flex gap-2">
                        <span className="min-w-[5.5rem] text-cream/70">{h.days}</span>
                        <span>{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>

            {/* Google Business Profile */}
            <a
              href={CONTACT.googleBusiness}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold-soft underline-offset-4 transition-colors hover:text-gold hover:underline"
            >
              <Star size={15} />
              הפרופיל והביקורות שלנו בגוגל
            </a>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold transition hover:bg-gold hover:text-emerald-deep"
              >
                <Instagram size={18} />
              </a>
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold transition hover:bg-gold hover:text-emerald-deep"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Lazy map */}
          <LazyMap />
        </Reveal>
      </div>
    </Section>
  )
}

/**
 * Click-to-load Google Maps embed — keeps the heavy iframe off the initial
 * render (mobile speed). No API key needed (keyless embed).
 * TODO(launch): an official Google "share → embed" URL can replace the q-based
 * src for a more precise pin.
 */
function LazyMap() {
  const [loaded, setLoaded] = useState(false)
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(
    'מתחם רגבה רגבה',
  )}&z=15&output=embed`

  return (
    <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-2xl border border-cream/10">
      {loaded ? (
        <iframe
          src={src}
          title="מפת הגעה לאחוזת סנדרין — מתחם רגבה"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          aria-label="טעינת מפת הגעה"
          className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald to-emerald-deep text-cream transition-colors"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold transition-transform group-hover:scale-110">
            <MapPin size={26} />
          </span>
          <span className="font-serif text-lg">מפת הגעה</span>
          <span className="text-sm text-cream/70">לחצו לטעינת המפה</span>
        </button>
      )}
    </div>
  )
}
