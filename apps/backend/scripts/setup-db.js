const { execSync } = require('child_process');
const path = require('path');

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
  console.log('📧 Default user created:');
  console.log('   Email: example@gmail.com');
  console.log('   Password: 0p;/)P:?');
  console.log('   Role: Practice Administrator');

} catch (error) {
  console.error('❌ Error during database setup:', error.message);
  process.exit(1);
} 