
// Enhanced input validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validateFullName = (name: string): boolean => {
  // Allow letters, spaces, hyphens, and apostrophes, 2-50 characters
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/;
  return nameRegex.test(name.trim());
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic international phone number validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateJsonInput = (input: string): boolean => {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeJsonInput = (input: any): any => {
  if (typeof input === 'string') {
    return sanitizeInput(input);
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeJsonInput);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[sanitizeInput(key)] = sanitizeJsonInput(value);
    }
    return sanitized;
  }
  return input;
};
