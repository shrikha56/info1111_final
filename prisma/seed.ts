import { PrismaClient, UserRole, RequestStatus, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.notification.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.maintenanceRequest.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.building.deleteMany({});
  await prisma.announcement.deleteMany({});

  console.log('Seeding database...');

  // Create a building
  const building = await prisma.building.create({
    data: {
      name: 'Oceanview Towers',
      address: '123 Beach Road, Sydney NSW 2000',
    },
  });

  console.log('Created building:', building.name);

  // Create properties
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        unitNumber: '101',
        address: '123 Beach Road, Unit 101, Sydney NSW 2000',
        building: { connect: { id: building.id } },
      },
    }),
    prisma.property.create({
      data: {
        unitNumber: '102',
        address: '123 Beach Road, Unit 102, Sydney NSW 2000',
        building: { connect: { id: building.id } },
      },
    }),
    prisma.property.create({
      data: {
        unitNumber: '201',
        address: '123 Beach Road, Unit 201, Sydney NSW 2000',
        building: { connect: { id: building.id } },
      },
    }),
  ]);

  console.log(`Created ${properties.length} properties`);

  // Create users with different roles
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123', // In production, use proper password hashing
      role: UserRole.ADMIN,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Property Manager',
      email: 'manager@example.com',
      password: 'password123',
      role: UserRole.PROPERTY_MANAGER,
    },
  });

  const maintenance = await prisma.user.create({
    data: {
      name: 'Maintenance Staff',
      email: 'maintenance@example.com',
      password: 'password123',
      role: UserRole.MAINTENANCE_STAFF,
    },
  });

  const residents = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Resident',
        email: 'john@example.com',
        password: 'password123',
        role: UserRole.RESIDENT,
        property: { connect: { id: properties[0].id } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Resident',
        email: 'jane@example.com',
        password: 'password123',
        role: UserRole.RESIDENT,
        property: { connect: { id: properties[1].id } },
      },
    }),
  ]);

  console.log(`Created ${residents.length + 3} users`);

  // Create maintenance requests
  const requests = await Promise.all([
    prisma.maintenanceRequest.create({
      data: {
        title: 'Leaking Faucet',
        description: 'The kitchen faucet is leaking and needs repair.',
        status: RequestStatus.PENDING,
        priority: Priority.MEDIUM,
        requester: { connect: { id: residents[0].id } },
        property: { connect: { id: properties[0].id } },
        images: ['https://example.com/image1.jpg'],
      },
    }),
    prisma.maintenanceRequest.create({
      data: {
        title: 'Broken Air Conditioner',
        description: 'The air conditioner in the living room is not working.',
        status: RequestStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        requester: { connect: { id: residents[0].id } },
        assignee: { connect: { id: maintenance.id } },
        property: { connect: { id: properties[0].id } },
        images: [],
      },
    }),
    prisma.maintenanceRequest.create({
      data: {
        title: 'Light Bulb Replacement',
        description: 'Need to replace light bulbs in the hallway.',
        status: RequestStatus.COMPLETED,
        priority: Priority.LOW,
        completedAt: new Date(),
        requester: { connect: { id: residents[1].id } },
        assignee: { connect: { id: maintenance.id } },
        property: { connect: { id: properties[1].id } },
        images: [],
      },
    }),
  ]);

  console.log(`Created ${requests.length} maintenance requests`);

  // Create comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'I will check this tomorrow.',
        request: { connect: { id: requests[0].id } },
        userId: maintenance.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Thank you for the quick response!',
        request: { connect: { id: requests[0].id } },
        userId: residents[0].id,
      },
    }),
  ]);

  console.log(`Created ${comments.length} comments`);

  // Create announcements
  const announcements = await Promise.all([
    prisma.announcement.create({
      data: {
        title: 'Building Maintenance Notice',
        content: 'The water will be shut off on Saturday from 10am to 2pm for maintenance.',
        building: { connect: { id: building.id } },
      },
    }),
    prisma.announcement.create({
      data: {
        title: 'Annual General Meeting',
        content: 'The annual general meeting will be held on June 15th at 7pm in the community room.',
        building: { connect: { id: building.id } },
      },
    }),
  ]);

  console.log(`Created ${announcements.length} announcements`);

  // Create notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        title: 'Maintenance Request Update',
        message: 'Your maintenance request for the leaking faucet has been assigned to a technician.',
        user: { connect: { id: residents[0].id } },
      },
    }),
    prisma.notification.create({
      data: {
        title: 'New Announcement',
        message: 'There is a new announcement about the building maintenance.',
        user: { connect: { id: residents[0].id } },
      },
    }),
    prisma.notification.create({
      data: {
        title: 'New Maintenance Request',
        message: 'A new maintenance request has been submitted for your attention.',
        user: { connect: { id: maintenance.id } },
      },
    }),
  ]);

  console.log(`Created ${notifications.length} notifications`);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
