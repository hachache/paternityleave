import { forwardRef, memo, type ButtonHTMLAttributes } from 'react';
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
  primary: 'bg-brand-600 hover:bg-brand-700 text-white border-transparent shadow-lg shadow-brand-500/30 hover:shadow-brand-600/40',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm',
  outline: 'bg-transparent hover:bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent shadow-lg shadow-red-500/30',
  ghost: 'bg-transparent hover:bg-slate-100/50 text-slate-600 hover:text-brand-700 border-transparent'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-3 py-2 text-sm',
  md: 'min-h-11 px-5 py-2.5 text-sm sm:text-base',
  lg: 'min-h-12 px-8 py-3.5 text-base sm:text-lg'
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-4 h-4 sm:w-5 sm:h-5',
  lg: 'w-5 h-5 sm:w-6 sm:h-6'
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
      'inline-flex items-center justify-center gap-2.5 rounded-xl font-medium tracking-wide transition-all duration-300 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:shadow-none';

    const widthStyle = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

    return (
      <button ref={ref} className={combinedClassName} disabled={disabled} type={type} {...props}>
        {Icon && iconPosition === 'left' && <Icon className={iconSizeStyles[size]} strokeWidth={2.5} />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className={iconSizeStyles[size]} strokeWidth={2.5} />}
      </button>
    );
  }
);

Button.displayName = 'Button';
