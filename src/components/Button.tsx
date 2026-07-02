import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-br from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white border-transparent shadow-lg shadow-brand-500/25 hover:shadow-brand-600/40 hover:shadow-glow',
  secondary:
    'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-sm',
  outline:
    'bg-transparent hover:bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900',
  danger:
    'bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white border-transparent shadow-lg shadow-red-500/25 hover:shadow-red-600/40',
  ghost:
    'bg-transparent hover:bg-slate-100/50 text-slate-600 hover:text-brand-700 border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-3.5 py-2 text-sm',
  md: 'min-h-11 px-5 py-2.5 text-sm',
  lg: 'min-h-12 px-7 py-3 text-sm sm:text-base',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-4 h-4 sm:w-5 sm:h-5',
  lg: 'w-5 h-5 sm:w-6 sm:h-6',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2.5 rounded-xl font-medium tracking-wide transition-all duration-300 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none';

    const hoverLift = disabled ? '' : 'hover:-translate-y-0.5';

    const widthStyle = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${hoverLift} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`
      .trim();

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled}
        type={type}
        {...props}
      >
        {Icon && iconPosition === 'left' && (
          <Icon
            className={iconSizeStyles[size]}
            strokeWidth={2.5}
            aria-hidden="true"
          />
        )}
        {children}
        {Icon && iconPosition === 'right' && (
          <Icon
            className={iconSizeStyles[size]}
            strokeWidth={2.5}
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
