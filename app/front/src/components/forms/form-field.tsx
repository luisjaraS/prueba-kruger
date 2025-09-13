'use client';

import { ReactNode } from 'react';
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
  ControllerProps,
} from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  render: ControllerProps<TFieldValues, TName>['render'];
  disabled?: boolean;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, render, disabled }: FormFieldProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={render}
    />
  );
}

interface FormItemProps {
  className?: string;
  children: ReactNode;
}

export function FormItem({ className, children }: FormItemProps) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}

interface FormLabelProps {
  className?: string;
  children: ReactNode;
  required?: boolean;
}

export function FormLabel({ className, children, required }: FormLabelProps) {
  return (
    <label className={cn('text-sm font-medium leading-none', className)}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

interface FormControlProps {
  children: ReactNode;
}

export function FormControl({ children }: FormControlProps) {
  return <div className="relative">{children}</div>;
}

interface FormDescriptionProps {
  className?: string;
  children: ReactNode;
}

export function FormDescription({ className, children }: FormDescriptionProps) {
  return <p className={cn('text-sm text-gray-600', className)}>{children}</p>;
}

interface FormMessageProps {
  className?: string;
  children?: ReactNode;
}

export function FormMessage({ className, children }: FormMessageProps) {
  if (!children) return null;

  return (
    <p className={cn('text-sm font-medium text-red-600', className)}>
      {children}
    </p>
  );
}
