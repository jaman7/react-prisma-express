import { faker } from '@faker-js/faker';
import clientPrisma from '@/prisma-client';

const defaultMoveRules = {
  TO_DO: ['IN_PROGRESS'],
  IN_PROGRESS: ['TO_DO', 'CR'],
  CR: ['IN_PROGRESS', 'READY_FOR_TEST'],
  READY_FOR_TEST: ['CR', 'TESTING'],
  TESTING: ['READY_FOR_TEST', 'DONE'],
  DONE: [],
  BLOCKED: ['TO_DO'],
};

const generate = async () => {
  console.log('Seeding database...');

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
      email: 'test@test.io',
      name: 'jan',
      lastName: 'kowalski',
      password: '$2a$12$apv7ruACMxBmDxLNRoLkiuZi03F1KgZN58IZ5TsQwXKTT4PGE.3wG',
      role: 'ADMIN',
    },
  });
  users.push(adminUser);

  const projects = [];

  for (let i = 0; i < 15; i++) {
    const board = await clientPrisma.board.create({
      data: {},
    });

    const project = await clientPrisma.project.create({
      data: {
        name: `Project ${i + 1}`,
        description: faker.lorem.sentence(),
        boardId: board.id,
      },
    });

    await clientPrisma.board.update({
      where: { id: board.id },
      data: { projectId: project.id },
    });

    projects.push(project);

    await clientPrisma.moveRules.create({
      data: {
        boardId: board.id,
        rules: defaultMoveRules,
      },
    });

    await clientPrisma.column.createMany({
      data: [
        { name: 'To Do', position: 1, boardId: board.id, status: 'TO_DO' },
        { name: 'In Progress', position: 2, boardId: board.id, status: 'IN_PROGRESS' },
        { name: 'CR', position: 3, boardId: board.id, status: 'CR' },
        { name: 'Ready for test', position: 4, boardId: board.id, status: 'READY_FOR_TEST' },
        { name: 'Testing', position: 5, boardId: board.id, status: 'TESTING' },
        { name: 'Done', position: 6, boardId: board.id, status: 'DONE' },
      ],
    });

    const columns = await clientPrisma.column.findMany({
      where: { boardId: board.id },
    });

    for (const user of faker.helpers.arrayElements(users, faker.number.int({ min: 1, max: 5 }))) {
      await clientPrisma.projectOnUser.create({
        data: {
          projectId: project.id,
          userId: user.id,
          role: faker.helpers.arrayElement(['Owner', 'Developer', 'Tester']),
        },
      });
    }

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
            columnId: taskColumn.id,
            boardId: board.id,
            status: taskStatus,
          },
        });

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

generate();

export default generate;
