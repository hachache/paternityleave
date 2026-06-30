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
  primary: 'border-transparent bg-brand-600 text-white hover:bg-brand-500',
  secondary: 'border-transparent bg-white text-brand-600 hover:text-brand-500',
  outline: 'border-slate-200 bg-transparent text-slate-700 hover:border-slate-300 hover:bg-white',
  danger: 'border-transparent bg-red-600 text-white hover:bg-red-700',
  ghost: 'border-transparent bg-transparent text-slate-600 hover:text-brand-600'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 py-2 text-sm',
  md: 'min-h-11 px-5 py-2.5 text-[15px] sm:text-[17px]',
  lg: 'min-h-12 px-7 py-3 text-[17px] sm:text-lg'
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
      'inline-flex items-center justify-center gap-2.5 rounded-full border font-normal tracking-[-0.01em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50';

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
