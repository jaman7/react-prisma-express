import { faker } from '@faker-js/faker';
import clientPrisma from '@/prisma-client';

const generate = async () => {
  console.log('Seeding database...');

  // Create users with specific roles
  const users = [];
  for (let i = 0; i < 5; i++) {
    const tester = await clientPrisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.internet.password(),
        role: 'TESTER',
      },
    });
    users.push(tester);
  }

  for (let i = 0; i < 24; i++) {
    const developer = await clientPrisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.internet.password(),
        role: 'DEVELOPER',
      },
    });
    users.push(developer);
  }

  const adminUser = await clientPrisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      lastName: 'User',
      password: 'admin123',
      role: 'ADMIN',
    },
  });
  users.push(adminUser);

  console.log('users');
  console.log(users);

  // Create 15 Projects
  const projects = [];
  for (let i = 0; i < 15; i++) {
    const project = await clientPrisma.project.create({
      data: {
        name: `Project ${i + 1}`,
        description: faker.lorem.sentence(),
      },
    });
    projects.push(project);

    // Create Board for each project
    const board = await clientPrisma.board.create({
      data: {
        name: `Board for ${project.name}`,
        projectId: project.id,
      },
    });

    // Create Columns for the board
    await clientPrisma.column.createMany({
      data: [
        { name: 'To Do', position: 1, boardId: board.id, status: 'TO_DO' },
        {
          name: 'In Progress',
          position: 2,
          boardId: board.id,
          status: 'IN_PROGRESS',
        },
        { name: 'CR', position: 3, boardId: board.id, status: 'CR' },
        {
          name: 'Ready for test',
          position: 4,
          boardId: board.id,
          status: 'READY_FOR_TEST',
        },
        { name: 'Testing', position: 5, boardId: board.id, status: 'TESTING' },
        { name: 'Done', position: 6, boardId: board.id, status: 'DONE' },
      ],
    });

    // Fetch created columns
    const columns = await clientPrisma.column.findMany({
      where: { boardId: board.id },
    });

    // Assign users to the project
    for (const user of faker.helpers.arrayElements(users, faker.number.int({ min: 1, max: 5 }))) {
      await clientPrisma.projectOnUser.create({
        data: {
          projectId: project.id,
          userId: user.id,
          role: faker.helpers.arrayElement(['Owner', 'Developer', 'Tester']),
        },
      });
    }

    // Create Tasks for the board
    const numTasks = faker.number.int({ min: 5, max: 50 });
    for (let j = 0; j < numTasks; j++) {
      const taskStatus = faker.helpers.arrayElement(['TO_DO', 'IN_PROGRESS', 'CR', 'READY_FOR_TEST', 'TESTING', 'DONE']);

      const taskColumn = columns.find((col) => col.status === taskStatus);

      if (taskColumn) {
        const task = await clientPrisma.task.create({
          data: {
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            position: j + 1,
            columnId: taskColumn.id, // Ensured non-optional
            boardId: board.id,
            status: taskStatus,
          },
        });

        // Assign users based on task status
        if (taskStatus === 'IN_PROGRESS' || taskStatus === 'CR') {
          const developer = faker.helpers.arrayElement(users.filter((user) => user.role === 'DEVELOPER'));
          await clientPrisma.task.update({
            where: { id: task.id },
            data: { userId: developer.id },
          });
        } else if (taskStatus === 'TESTING') {
          const tester = faker.helpers.arrayElement(users.filter((user) => user.role === 'TESTER'));
          await clientPrisma.task.update({
            where: { id: task.id },
            data: { userId: tester.id },
          });
        }
      } else {
        console.warn(`No column found for status: ${taskStatus}. Skipping task creation.`);
      }
    }
  }

  console.log('Database seeding completed.');
};

export default generate;
