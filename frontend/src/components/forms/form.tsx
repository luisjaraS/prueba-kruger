'use client';

import {
  useForm,
  FormProvider,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  UseFormProps,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormProps<T extends FieldValues> {
  schema?: z.ZodSchema<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
  defaultValues?: UseFormProps<T>['defaultValues'];
  mode?: UseFormProps<T>['mode'];
  resetAfterSubmit?: boolean;
}

export function Form<T extends Record<string, unknown>>({
  schema,
  onSubmit,
  children,
  className,
  defaultValues,
  mode = 'onChange',
  resetAfterSubmit = false,
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: schema ? zodResolver(schema as any) : undefined,
    defaultValues,
    mode,
  });

  const handleSubmit = form.handleSubmit(async (data: T) => {
    try {
      await onSubmit(data);
      if (resetAfterSubmit) {
        form.reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
        {children}
      </form>
    </FormProvider>
  );
}

// Hook para acceder al contexto del formulario
export function useFormContext<
  T extends FieldValues = FieldValues,
>(): UseFormReturn<T> {
  return useForm<T>();
}
