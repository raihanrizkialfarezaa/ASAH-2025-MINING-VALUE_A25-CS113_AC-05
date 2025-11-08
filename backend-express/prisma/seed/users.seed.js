import prisma from '../../src/config/database.js';
import bcrypt from 'bcrypt';

export const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      username: 'admin',
      email: 'admin@mining.com',
      fullName: 'Admin System',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
    {
      username: 'supervisor1',
      email: 'supervisor1@mining.com',
      fullName: 'John Supervisor',
      password: hashedPassword,
      role: 'SUPERVISOR',
      isActive: true,
    },
    {
      username: 'dispatcher1',
      email: 'dispatcher1@mining.com',
      fullName: 'Sarah Dispatcher',
      password: hashedPassword,
      role: 'DISPATCHER',
      isActive: true,
    },
    {
      username: 'operator1',
      email: 'operator1@mining.com',
      fullName: 'Mike Johnson',
      password: hashedPassword,
      role: 'OPERATOR',
      isActive: true,
    },
    {
      username: 'operator2',
      email: 'operator2@mining.com',
      fullName: 'David Anderson',
      password: hashedPassword,
      role: 'OPERATOR',
      isActive: true,
    },
    {
      username: 'operator3',
      email: 'operator3@mining.com',
      fullName: 'Robert Wilson',
      password: hashedPassword,
      role: 'OPERATOR',
      isActive: true,
    },
    {
      username: 'operator4',
      email: 'operator4@mining.com',
      fullName: 'James Brown',
      password: hashedPassword,
      role: 'OPERATOR',
      isActive: true,
    },
    {
      username: 'maintenance1',
      email: 'maintenance1@mining.com',
      fullName: 'Lisa Mechanic',
      password: hashedPassword,
      role: 'MAINTENANCE_STAFF',
      isActive: true,
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    createdUsers.push(user);
  }

  return createdUsers;
};
