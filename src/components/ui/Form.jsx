import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { Label } from './Label';

const FormField = ({ name, render, ...props }) => {
  const { control } = useFormContext();
  
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          {render({ field, error, ...props })}
          {error && (
            <p className="text-sm font-medium text-destructive">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props} />
));
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn('text-sm font-medium', className)} {...props} />
));
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('[&>*]:w-full', className)} {...props} />
));
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm font-medium text-destructive', className)} {...props} />
));
FormMessage.displayName = 'FormMessage';

export {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
