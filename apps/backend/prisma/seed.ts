import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Check if default user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'example@gmail.com' }
  });

  if (existingUser) {
    console.log('Default user already exists, skipping...');
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash('0p;/)P:?', 12);

  try {
    // Use Prisma transaction to ensure data consistency (following users.service pattern)
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Create the user record
      const user = await prisma.user.create({
        data: {
          email: 'example@gmail.com',
          password: hashedPassword,
          firstName: 'Default',
          lastName: 'User',
          middleName: '',
          suffix: '',
          userName: 'defaultuser',
          isActive: true,
        },
      });

      // 2. Create the staff profile
      const staffProfile = await prisma.staffProfile.create({
        data: {
          userId: user.id,
          employeeId: 'EMP001',
          npiNumber: '',
          licenseNumber: '',
          licenseState: '',
          licenseExpiryDate: new Date(),
          department: 'Administration',
          jobTitle: 'Practice Administrator',
          hireDate: new Date(),
          phoneNumber: '',
          billingRate: 0,
          canBillInsurance: true,
          status: 'active',
          notes: 'Default administrator account',
          
          // Additional fields for frontend forms
          userComments: '',
          mobilePhone: '',
          workPhone: '',
          homePhone: '',
          canReceiveText: false,
          address1: '',
          address2: '',
          city: '',
          state: '',
          zipCode: '',
          formalName: 'Default User',
          clinicianType: '',
        },
      });

      // 3. Create user role
      await prisma.userRole.create({
        data: {
          userId: user.id,
          role: 'Practice Administrator',
          assignedAt: new Date(),
          isActive: true,
        }
      });

      return {
        user,
        staffProfile,
        message: 'Default user created successfully.',
      };
    });

    console.log('Default user created:', result.user.email);
    console.log('Staff profile created for user ID:', result.staffProfile.userId);
    
  } catch (error) {
    console.error('Error creating default user:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 