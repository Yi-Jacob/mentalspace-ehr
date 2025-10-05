const { execSync } = require('child_process');
const path = require('path');

// Default admin email constant (should match the one in constants.ts)
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'example@gmail.com';

console.log('🚀 Setting up database for first time...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Run migrations
  console.log('🔄 Running database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  // Run seed
  console.log('🌱 Seeding database...');
  execSync('npm run db:seed', { stdio: 'inherit' });

  console.log('✅ Database setup completed successfully!');
  console.log('');
  console.log('📧 Admin user created:');
  console.log(`   Email: ${DEFAULT_ADMIN_EMAIL}`);
  console.log('   Role: Practice Administrator');
  console.log('');
  console.log('📋 Sample data created:');
  console.log('   - Staff members with user accounts and profiles');
  console.log('   - Sample clients with user accounts');
  console.log('   - Proper relationships between users, clients, and staff profiles');
  console.log('   - Supervision relationships between staff members');
  console.log('');
  console.log('🔗 Database relationships:');
  console.log('   - Users can be either staff or clients');
  console.log('   - Staff users reference StaffProfile records via staffId');
  console.log('   - Client users reference Client records via clientId');
  console.log('   - All users have proper authentication setup');
  console.log('');
  console.log('⚡ Performance optimizations:');
  console.log('   - Separate staffId and clientId columns for fast lookups');
  console.log('   - Unique constraints ensure data integrity');
  console.log('   - Direct foreign key relationships for efficient queries');
  console.log('   - Meaningful usernames for clients (e.g., jennifer.williams)');

} catch (error) {
  console.error('❌ Error during database setup:', error.message);
  process.exit(1);
} 