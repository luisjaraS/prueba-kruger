import { InputHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-md border bg-[var(--input-bg)] border-[var(--input-border)] px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--input-placeholder)] focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'focus-visible:ring-[var(--primary)]',
        outline:
          'border-2 focus-visible:ring-[var(--primary)] focus-visible:border-[var(--primary)]',
        filled:
          'bg-[var(--secondary)] border-transparent focus-visible:bg-[var(--card-bg)] focus-visible:ring-[var(--primary)]',
      },
      size: {
        sm: 'h-8 text-xs',
        md: 'h-9',
        lg: 'h-10 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          className={cn(
            inputVariants({ variant, size }),
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && (
          <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
