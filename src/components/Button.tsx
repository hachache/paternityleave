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
  primary: 'bg-black hover:opacity-85 text-white border-black shadow-sm',
  secondary: 'bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border-black/10 shadow-sm',
  outline: 'bg-transparent hover:bg-[#f5f5f7] text-[#1d1d1f] border-black/15',
  danger: 'bg-[#ff3b30] hover:opacity-90 text-white border-transparent shadow-sm',
  ghost: 'bg-transparent hover:bg-[#f5f5f7] text-[#424245] border-transparent'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm sm:text-base',
  lg: 'px-8 py-3.5 text-base sm:text-lg'
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
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2.5 rounded-full font-medium tracking-tight transition-all duration-300 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

    const widthStyle = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

    return (
      <button ref={ref} className={combinedClassName} disabled={disabled} {...props}>
        {Icon && iconPosition === 'left' && <Icon className={iconSizeStyles[size]} strokeWidth={2.2} />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className={iconSizeStyles[size]} strokeWidth={2.2} />}
      </button>
    );
  }
);

Button.displayName = 'Button';
