import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordValidationService {
  private readonly commonWords = [
    'password', 'admin', 'user', 'login', 'welcome', 'qwerty', 'abc123', '123456',
    'password123', 'admin123', 'user123', 'welcome123', 'qwerty123', 'mentalspace',
    'mental', 'health', 'therapy', 'clinic', 'doctor', 'patient', 'client'
  ];

  private readonly sequentialPatterns = [
    '123', '234', '345', '456', '567', '678', '789', '890',
    'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz',
    'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop',
    'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl',
    'zxc', 'xcv', 'cvb', 'vbn', 'bnm'
  ];

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Length validation
    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long for HIPAA compliance');
    }

    if (password.length > 128) {
      errors.push('Password must be no more than 128 characters long');
    }

    // Character requirements
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

    // Pattern validation
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain more than 2 consecutive identical characters');
    }

    // Sequential character check
    const lowerPassword = password.toLowerCase();
    for (const pattern of this.sequentialPatterns) {
      if (lowerPassword.includes(pattern)) {
        errors.push(`Password cannot contain sequential characters (${pattern})`);
        break;
      }
    }

    // Dictionary word check
    for (const word of this.commonWords) {
      if (lowerPassword.includes(word)) {
        errors.push('Password cannot contain common words or patterns');
        break;
      }
    }

    // Keyboard pattern check
    const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvbn', '123456', '654321'];
    for (const pattern of keyboardPatterns) {
      if (lowerPassword.includes(pattern)) {
        errors.push('Password cannot contain keyboard patterns');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getPasswordStrength(password: string): { score: number; level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong' } {
    if (!password) return { score: 0, level: 'weak' };

    let score = 0;

    // Length scoring
    if (password.length >= 12) score += 2;
    if (password.length >= 16) score += 2;
    if (password.length >= 20) score += 1;

    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;

    // Bonus for additional special characters
    const specialCharCount = (password.match(/[@$!%*?&]/g) || []).length;
    if (specialCharCount > 1) score += 1;

    // Penalties for weak patterns
    if (/(.)\1{2,}/.test(password)) score -= 2;
    
    const lowerPassword = password.toLowerCase();
    for (const pattern of this.sequentialPatterns) {
      if (lowerPassword.includes(pattern)) {
        score -= 2;
        break;
      }
    }

    for (const word of this.commonWords) {
      if (lowerPassword.includes(word)) {
        score -= 3;
        break;
      }
    }

    // Determine level
    let level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
    if (score <= 2) level = 'weak';
    else if (score <= 4) level = 'fair';
    else if (score <= 6) level = 'good';
    else if (score <= 8) level = 'strong';
    else level = 'very-strong';

    return { score: Math.max(0, score), level };
  }

  generateSecurePassword(length: number = 16): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '@$!%*?&';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    
    // Ensure at least one character from each category
    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest with random characters
    const remainingLength = Math.max(0, length - password.length);
    for (let i = 0; i < remainingLength; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password to avoid predictable patterns
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}
