/**
 * Lightweight, dependency-free input validation helpers for CMS CRUD endpoints.
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const isNonEmptyString = (val: unknown): val is string => {
  return typeof val === 'string' && val.trim().length > 0;
};

export const isOptionalString = (val: unknown): val is string | undefined | null => {
  return val === undefined || val === null || typeof val === 'string';
};

export const isValidNumber = (val: unknown): val is number => {
  return typeof val === 'number' && !Number.isNaN(val);
};

export const isValidBoolean = (val: unknown): val is boolean => {
  return typeof val === 'boolean';
};

export const isValidStringArray = (val: unknown): val is string[] => {
  return Array.isArray(val) && val.every((item) => typeof item === 'string');
};

export const isValidEnum = <T extends Record<string, string>>(val: unknown, enumObj: T): val is T[keyof T] => {
  return typeof val === 'string' && Object.values(enumObj).includes(val as T[keyof T]);
};

export const validateRequired = (
  fields: { name: string; value: unknown; validator?: (val: unknown) => boolean; customMessage?: string }[]
): ValidationResult => {
  for (const field of fields) {
    const check = field.validator ? field.validator(field.value) : isNonEmptyString(field.value);
    if (!check) {
      return {
        isValid: false,
        message: field.customMessage || `${field.name} is required and must be valid`,
      };
    }
  }
  return { isValid: true };
};
