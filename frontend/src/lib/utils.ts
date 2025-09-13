import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind CSS de forma inteligente
 * Evita conflictos entre clases y permite sobrescribir estilos
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Crea un formatter para estilos condicionalmente
 */
export function cva(
  base: string,
  config?: {
    variants?: Record<string, Record<string, string>>;
    defaultVariants?: Record<string, string>;
  }
) {
  return (props?: Record<string, any>) => {
    if (!config?.variants || !props) return base;

    const variantClasses = Object.entries(props)
      .map(([key, value]) => config.variants?.[key]?.[value])
      .filter(Boolean);

    return cn(base, ...variantClasses);
  };
}
