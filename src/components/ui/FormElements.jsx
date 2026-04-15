import React from 'react';
import { Input } from './Input';
import { Label } from './Label';
import { cn } from '../../lib/utils';

/**
 * FormGroup - A reusable form field wrapper with label, input, and error handling
 */
const FormGroup = React.forwardRef(
  ({ label, error, required, helpText, children, className, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', className)} {...props} ref={ref}>
        {label && (
          <Label>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {children}
        {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      </div>
    );
  }
);

FormGroup.displayName = 'FormGroup';

/**
 * TextInput - Simple wrapper around Input with FormGroup
 */
const TextInput = React.forwardRef(
  ({ label, error, required, helpText, ...props }, ref) => (
    <FormGroup label={label} error={error} required={required} helpText={helpText}>
      <Input ref={ref} {...props} />
    </FormGroup>
  )
);

TextInput.displayName = 'TextInput';

/**
 * Textarea - Extended input for longer text
 */
const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  />
));

Textarea.displayName = 'Textarea';

/**
 * FileInput - File upload wrapper
 */
const FileInput = React.forwardRef(({ className, ...props }, ref) => (
  <input
    type="file"
    className={cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-primary file:text-primary-foreground file:px-3 file:py-1.5 file:text-sm file:font-medium file:cursor-pointer hover:file:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  />
));

FileInput.displayName = 'FileInput';

export { FormGroup, TextInput, Textarea, FileInput };
