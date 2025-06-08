
import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface FieldConfig {
  [key: string]: ValidationRule;
}

interface UseAccessibleFormProps {
  initialValues: Record<string, any>;
  validationRules: FieldConfig;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
}

export const useAccessibleForm = ({ 
  initialValues, 
  validationRules, 
  onSubmit 
}: UseAccessibleFormProps) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: string, value: any): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;

    if (rules.required && (!value || value.toString().trim() === '')) {
      return 'Este campo es obligatorio';
    }

    if (rules.minLength && value.toString().length < rules.minLength) {
      return `Debe tener al menos ${rules.minLength} caracteres`;
    }

    if (rules.maxLength && value.toString().length > rules.maxLength) {
      return `No puede tener más de ${rules.maxLength} caracteres`;
    }

    if (rules.pattern && !rules.pattern.test(value.toString())) {
      return 'El formato no es válido';
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [validationRules]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validar campo individual si ya ha sido tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validar campo al perder el foco
    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  }, [values, validateField]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setIsSubmitting(true);

    if (validateForm()) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Error al enviar formulario:', error);
      }
    } else {
      // Enfocar el primer campo con error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
        element?.focus();
      }
    }

    setIsSubmitting(false);
  }, [values, validateForm, onSubmit, errors]);

  const getFieldProps = useCallback((name: string) => ({
    name,
    value: values[name] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
      handleChange(name, e.target.value),
    onBlur: () => handleBlur(name),
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  }), [values, errors, handleChange, handleBlur]);

  const getErrorProps = useCallback((name: string) => ({
    id: `${name}-error`,
    role: 'alert' as const,
    'aria-live': 'polite' as const,
  }), []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    getErrorProps,
    setFieldValue: handleChange,
    setFieldError: (name: string, error: string) => setErrors(prev => ({ ...prev, [name]: error })),
    resetForm: () => {
      setValues(initialValues);
      setErrors({});
      setTouched({});
    },
  };
};
