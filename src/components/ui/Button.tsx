import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'outlineLight' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  // solid emerald → gold on hover
  primary:
    'bg-emerald text-cream shadow-soft hover:bg-gold hover:text-emerald-deep hover:shadow-card',
  // gold outline on light surfaces
  outline:
    'border border-gold/70 text-emerald hover:bg-gold hover:text-emerald-deep hover:border-gold',
  // gold outline on dark surfaces
  outlineLight:
    'border border-gold/70 text-cream hover:bg-gold hover:text-emerald-deep hover:border-gold',
  ghost: 'text-emerald hover:text-gold',
}

const sizes: Record<Size, string> = {
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }
type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...rest }, ref) => {
    const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`

    if (rest.as === 'a') {
      const { as: _as, ...anchorProps } = rest
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} className={cls} {...anchorProps}>
          {children}
        </a>
      )
    }

    const { as: _as, ...buttonProps } = rest as ButtonAsButton
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={cls} {...buttonProps}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
