
import { renderHook, act } from '@testing-library/react';
import { usePasswordValidation } from '../usePasswordValidation';

describe('usePasswordValidation', () => {
  test('should return initial validation state', () => {
    const { result } = renderHook(() => usePasswordValidation());

    expect(result.current.validation).toEqual({
      isValid: true,
      errors: []
    });
  });

  test('should validate password with all requirements', () => {
    const { result } = renderHook(() => usePasswordValidation());

    act(() => {
      result.current.validatePassword('ValidPass123!');
    });

    expect(result.current.validation.isValid).toBe(true);
    expect(result.current.validation.errors).toEqual([]);
  });

  test('should return errors for invalid password', () => {
    const { result } = renderHook(() => usePasswordValidation());

    act(() => {
      result.current.validatePassword('weak');
    });

    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.errors).toContain('La contraseña debe tener al menos 8 caracteres');
    expect(result.current.validation.errors).toContain('Debe contener al menos una letra mayúscula');
    expect(result.current.validation.errors).toContain('Debe contener al menos un número');
    expect(result.current.validation.errors).toContain('Debe contener al menos un carácter especial');
  });

  test('should validate minimum length requirement', () => {
    const { result } = renderHook(() => usePasswordValidation());

    act(() => {
      result.current.validatePassword('Test1!');
    });

    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.errors).toContain('La contraseña debe tener al menos 8 caracteres');
  });

  test('should validate uppercase requirement', () => {
    const { result } = renderHook(() => usePasswordValidation());

    act(() => {
      result.current.validatePassword('testpass123!');
    });

    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.errors).toContain('Debe contener al menos una letra mayúscula');
  });

  test('should validate lowercase requirement', () => {
    const { result } = renderHook(() => usePasswordValidation());

    act(() => {
      result.current.validatePassword('TESTPASS123!');
    });

    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.errors).toContain('Debe contener al menos una letra minúscula');
  });

  test('should validate number requirement', () => {
    const { result } = renderHook(() => usePasswordValidation());

    act(() => {
      result.current.validatePassword('TestPass!');
    });

    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.errors).toContain('Debe contener al menos un número');
  });

  test('should validate special character requirement', () => {
    const { result } = renderHook(() => usePasswordValidation());

    act(() => {
      result.current.validatePassword('TestPass123');
    });

    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.errors).toContain('Debe contener al menos un carácter especial');
  });
});
