
export const cleanupAuthState = () => {
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // HIPAA-compliant password requirements
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be no more than 128 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain more than 2 consecutive identical characters');
  }
  
  // Check for common dictionary words (basic check)
  const commonWords = ['password', 'admin', 'user', 'login', 'welcome', 'qwerty', 'abc123', '123456'];
  const lowerPassword = password.toLowerCase();
  for (const word of commonWords) {
    if (lowerPassword.includes(word)) {
      errors.push('Password cannot contain common words or patterns');
      break;
    }
  }
  
  // Check for sequential characters
  if (/123|abc|qwe|asd|zxc/i.test(password)) {
    errors.push('Password cannot contain sequential characters (123, abc, etc.)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
