import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = 'default', size = 'md', asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold tracking-tight ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:border-primary/40 hover:bg-primary/5 hover:text-primary',
    secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/85',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-lg px-3',
    lg: 'h-12 rounded-xl px-8 text-base',
    icon: 'h-10 w-10',
  };

  return (
    <Comp
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };
