import { forwardRef, ButtonHTMLAttributes } from 'react';
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
  primary: 'bg-teal-600 hover:bg-teal-700 text-white border-transparent shadow-md hover:shadow-lg',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300/50',
  outline: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent shadow-md hover:shadow-lg',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 border-transparent'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 sm:px-6 py-2.5 sm:py-3 text-base',
  lg: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg'
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'w-3.5 h-3.5',
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
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-apple-smooth border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:scale-[0.98] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

    const widthStyle = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

    return (
      <button ref={ref} className={combinedClassName} disabled={disabled} {...props}>
        {Icon && iconPosition === 'left' && <Icon className={iconSizeStyles[size]} />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className={iconSizeStyles[size]} />}
      </button>
    );
  }
);

Button.displayName = 'Button';
