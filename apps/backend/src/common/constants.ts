/**
 * Application constants
 */

// Default password for new users (staff and clients)
// This should be set in your .env file as DEFAULT_PASSWORD
export const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || 'Kx9mP2$nQ8!vR5@';

// Default admin email for the practice administrator
// This should be set in your .env file as DEFAULT_ADMIN_EMAIL
export const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@chctherapy.com';

// Bcrypt configuration
export const BCRYPT_SALT_ROUNDS = 12;

// Other constants can be added here as needed
