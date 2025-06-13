
export function validateMessage(message: any): { isValid: boolean; sanitizedMessage?: string; error?: string } {
  if (!message || typeof message !== 'string' || message.length > 1000) {
    return {
      isValid: false,
      error: 'Invalid message format or length'
    };
  }

  const sanitizedMessage = message.trim().substring(0, 1000);
  
  return {
    isValid: true,
    sanitizedMessage
  };
}
