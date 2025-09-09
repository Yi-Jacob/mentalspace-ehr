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
  } else {
    // Hash the password
    const hashedPassword = await bcrypt.hash('0p;/)P:?', 12);

    try {
      // Use Prisma transaction to ensure data consistency (following users.service pattern)
      const result = await prisma.$transaction(async (prisma) => {
        // 1. Create the staff profile first
        const staffProfile = await prisma.staffProfile.create({
          data: {
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

        // 2. Create the user record with reference to staff profile
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
            staffId: staffProfile.id,
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
      console.log('Staff profile created for user ID:', result.user.id);
      
    } catch (error) {
      console.error('Error creating default user:', error);
      throw error;
    }
  }

  // Create additional staff members
  console.log('Creating additional staff members...');
  
  const additionalStaff = [
    {
      email: 'dr.sarah.johnson@mentalspace.com',
      password: 'SecurePass123!',
      firstName: 'Sarah',
      lastName: 'Johnson',
      middleName: 'Elizabeth',
      suffix: 'PhD',
      userName: 'dr.sarah.johnson',
      employeeId: 'EMP002',
      npiNumber: '1234567890',
      licenseNumber: 'PSY12345',
      licenseState: 'CA',
      department: 'Clinical Services',
      jobTitle: ['Clinician', 'Supervisor'],
      clinicianType: 'Clinical Psychologist',
      billingRate: 150.00,
      canBillInsurance: true,
      status: 'active',
      supervisionType: 'supervisor',
      notes: 'Experienced psychologist specializing in trauma therapy and CBT',
      address1: '1234 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      phoneNumber: '(415) 555-0101',
      mobilePhone: '(415) 555-0102',
      workPhone: '(415) 555-0103',
      canReceiveText: true,
      formalName: 'Dr. Sarah Elizabeth Johnson, PhD'
    },
    {
      email: 'michael.chen@mentalspace.com',
      password: 'SecurePass123!',
      firstName: 'Michael',
      lastName: 'Chen',
      middleName: 'David',
      suffix: 'LCSW',
      userName: 'michael.chen',
      employeeId: 'EMP003',
      npiNumber: '0987654321',
      licenseNumber: 'LCSW78901',
      licenseState: 'CA',
      department: 'Clinical Services',
      jobTitle: ['Clinician'],
      clinicianType: 'Licensed Clinical Social Worker',
      billingRate: 120.00,
      canBillInsurance: true,
      status: 'active',
      supervisionType: 'supervisee',
      notes: 'New LCSW specializing in family therapy and substance abuse',
      address1: '5678 Pine Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      phoneNumber: '(415) 555-0201',
      mobilePhone: '(415) 555-0202',
      workPhone: '(415) 555-0203',
      canReceiveText: true,
      formalName: 'Michael David Chen, LCSW'
    },
    {
      email: 'emily.rodriguez@mentalspace.com',
      password: 'SecurePass123!',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      middleName: 'Maria',
      suffix: 'LMFT',
      userName: 'emily.rodriguez',
      employeeId: 'EMP004',
      npiNumber: '1122334455',
      licenseNumber: 'LMFT45678',
      licenseState: 'CA',
      department: 'Clinical Services',
      jobTitle: ['Clinician'],
      clinicianType: 'Licensed Marriage and Family Therapist',
      billingRate: 130.00,
      canBillInsurance: true,
      status: 'active',
      supervisionType: 'supervisee',
      notes: 'Experienced LMFT specializing in couples therapy and adolescent issues',
      address1: '9012 Maple Drive',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94104',
      phoneNumber: '(415) 555-0301',
      mobilePhone: '(415) 555-0302',
      workPhone: '(415) 555-0303',
      canReceiveText: true,
      formalName: 'Emily Maria Rodriguez, LMFT'
    }
  ];

  const createdStaff = [];
  
  for (const staffData of additionalStaff) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: staffData.email }
      });

      if (existingUser) {
        console.log(`Staff member ${staffData.email} already exists, skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(staffData.password, 12);
      
      const result = await prisma.$transaction(async (prisma) => {
        // Create staff profile first
        const staffProfile = await prisma.staffProfile.create({
          data: {
            employeeId: staffData.employeeId,
            npiNumber: staffData.npiNumber,
            licenseNumber: staffData.licenseNumber,
            licenseState: staffData.licenseState,
            licenseExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            department: staffData.department,
            jobTitle: staffData.jobTitle.join(', '),
            hireDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            phoneNumber: staffData.phoneNumber,
            billingRate: staffData.billingRate,
            canBillInsurance: staffData.canBillInsurance,
            status: staffData.status,
            notes: staffData.notes,
            supervisionType: staffData.supervisionType,
            address1: staffData.address1,
            city: staffData.city,
            state: staffData.state,
            zipCode: staffData.zipCode,
            mobilePhone: staffData.mobilePhone,
            workPhone: staffData.workPhone,
            canReceiveText: staffData.canReceiveText,
            formalName: staffData.formalName,
            clinicianType: staffData.clinicianType,
          },
        });

        // Create user with reference to staff profile
        const user = await prisma.user.create({
          data: {
            email: staffData.email,
            password: hashedPassword,
            firstName: staffData.firstName,
            lastName: staffData.lastName,
            middleName: staffData.middleName,
            suffix: staffData.suffix,
            userName: staffData.userName,
            isActive: true,
            staffId: staffProfile.id,
          },
        });

        // Create user role
        for (const role of staffData.jobTitle) {
          await prisma.userRole.create({
            data: {
              userId: user.id,
              role: role,
              assignedAt: new Date(),
              isActive: true,
            }
          });
        }
        return { user, staffProfile };
      });

      createdStaff.push(result);
      console.log(`Staff member created: ${result.user.email}`);
      
    } catch (error) {
      console.error(`Error creating staff member ${staffData.email}:`, error);
    }
  }

  // Create clients with user records
  console.log('Creating clients with user records...');
  
  const clients = [
    {
      firstName: 'Jennifer',
      middleName: 'Marie',
      lastName: 'Williams',
      preferredName: 'Jenny',
      pronouns: 'she/her',
      dateOfBirth: new Date('1992-05-15'),
      administrativeSex: 'Female',
      genderIdentity: 'Female',
      sexualOrientation: 'Straight',
      email: 'jenny.williams@email.com',
      address1: '2345 Elm Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      timezone: 'America/Los_Angeles',
      race: 'White',
      ethnicity: 'Not Hispanic or Latino',
      languages: 'English',
      maritalStatus: 'Single',
      employmentStatus: 'Employed',
      religiousAffiliation: 'None',
      smokingStatus: 'Never smoked',
      appointmentReminders: 'Email and SMS',
      hipaaSigned: true,
      pcpRelease: 'Signed',
      patientComments: 'Prefers afternoon appointments',
      isActive: true
    },
    {
      firstName: 'Marcus',
      middleName: 'James',
      lastName: 'Thompson',
      preferredName: 'Marcus',
      pronouns: 'he/him',
      dateOfBirth: new Date('1988-11-22'),
      administrativeSex: 'Male',
      genderIdentity: 'Male',
      sexualOrientation: 'Gay',
      email: 'marcus.thompson@email.com',
      address1: '3456 Cedar Lane',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94106',
      timezone: 'America/Los_Angeles',
      race: 'Black or African American',
      ethnicity: 'Not Hispanic or Latino',
      languages: 'English',
      maritalStatus: 'Married',
      employmentStatus: 'Self-employed',
      religiousAffiliation: 'None',
      smokingStatus: 'Former smoker',
      appointmentReminders: 'Email only',
      hipaaSigned: true,
      pcpRelease: 'Signed',
      patientComments: 'Available for evening sessions',
      isActive: true
    },
    {
      firstName: 'Sofia',
      middleName: 'Isabella',
      lastName: 'Martinez',
      preferredName: 'Sofia',
      pronouns: 'she/her',
      dateOfBirth: new Date('1995-03-08'),
      administrativeSex: 'Female',
      genderIdentity: 'Female',
      sexualOrientation: 'Bisexual',
      email: 'sofia.martinez@email.com',
      address1: '4567 Birch Road',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      timezone: 'America/Los_Angeles',
      race: 'Hispanic or Latino',
      ethnicity: 'Hispanic or Latino',
      languages: 'English, Spanish',
      maritalStatus: 'Divorced',
      employmentStatus: 'Employed',
      religiousAffiliation: 'Catholic',
      smokingStatus: 'Never smoked',
      appointmentReminders: 'SMS only',
      hipaaSigned: true,
      pcpRelease: 'Signed',
      patientComments: 'Prefers Spanish-speaking therapist when available',
      isActive: true
    }
  ];

  const createdClients = [];
  
  for (const clientData of clients) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: clientData.email }
      });

      if (existingUser) {
        console.log(`Client ${clientData.email} already exists, skipping...`);
        continue;
      }

      const result = await prisma.$transaction(async (prisma) => {
        // Create the client
        const client = await prisma.client.create({
          data: clientData
        });

        // Create a user record for the client
        const clientUser = await prisma.user.create({
          data: {
            email: clientData.email || `client.${client.id}@example.com`,
            firstName: clientData.firstName,
            lastName: clientData.lastName,
            middleName: clientData.middleName,
            userName: `${clientData.firstName.toLowerCase()}.${clientData.lastName.toLowerCase()}`,
            isActive: true,
            clientId: client.id,
          },
        });

        return { client, user: clientUser };
      });
      
      createdClients.push(result);
      console.log(`Client created: ${result.client.firstName} ${result.client.lastName} with user ID: ${result.user.id}`);
      
    } catch (error) {
      console.error(`Error creating client ${clientData.firstName} ${clientData.lastName}:`, error);
    }
  }

  // Create supervision relationships
  console.log('Creating supervision relationships...');
  
  try {
    // Find Dr. Sarah Johnson (senior therapist)
    const seniorTherapist = createdStaff.find(staff => 
      staff.user.email === 'dr.sarah.johnson@mentalspace.com'
    );
    
    // Find Michael Chen (junior therapist)
    const juniorTherapist1 = createdStaff.find(staff => 
      staff.user.email === 'michael.chen@mentalspace.com'
    );

    if (seniorTherapist && juniorTherapist1) {
      await prisma.supervisionRelationship.create({
        data: {
          supervisorId: seniorTherapist.user.id,
          superviseeId: juniorTherapist1.user.id,
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          status: 'active',
          notes: 'Weekly supervision focusing on family therapy cases and substance abuse treatment',
        }
      });
      console.log('Supervision relationship created: Dr. Sarah Johnson → Michael Chen');
    }
    
  } catch (error) {
    console.error('Error creating supervision relationships:', error);
  }

  console.log('Database seeding completed successfully!');
  console.log(`Created ${createdStaff.length} additional staff members`);
  console.log(`Created ${createdClients.length} clients with user records`);
  console.log('Created supervision relationships');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 