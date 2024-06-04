// // seed.js

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   const main = async () => {
//     await prisma.board.create({
//       data: {
//         name: "Board Default",
//         isActive: false,
//         columns: {
//           create: [
//             {
//               name: "Todo",
//               position: 0,
//             },
//             {
//               name: "Doing",
//               position: 1,
//             },
//             {
//               name: "Test",
//               position: 2,
//             },
//             {
//               name: "Done",
//               position: 3,
//             },
//           ],
//         },
//         tasks: {
//           create: [
//             {
//               title: "Create ui",
//               content: "lorem ipsum",
//               position: 0,
//               status: 0,
//               taskIdentifier: "NUC-1",
//               userId: 1,
//             },
//           ],
//         },
//       },
//       //   include: {
//       //     columns: true,
//       //     tasks: true,
//       //   },
//     });

//     await prisma.board.create({
//       data: {
//         name: "Board 2",
//         isActive: true,
//         columns: {
//           create: [
//             { name: "Column 1", position: 0 },
//             { name: "Column 2", position: 1 },
//             { name: "Column 3", position: 2 },
//           ],
//         },
//         tasks: {
//           create: [
//             {
//               title: "Task 1",
//               content: "Task 1 content",
//               status: 0,
//               position: 0,
//               taskIdentifier: "T1",
//               userId: 1,
//             },
//             {
//               title: "Task 2",
//               content: "Task 2 content",
//               status: 0,
//               position: 1,
//               taskIdentifier: "T2",
//               userId: 1,
//             },
//             {
//               title: "Task 3",
//               content: "Task 3 content",
//               status: 0,
//               position: 2,
//               taskIdentifier: "T3",
//               userId: 1,
//             },
//           ],
//         },
//       },
//       //   include: {
//       //     columns: true,
//       //     tasks: true,
//       //   },
//     });
//   };
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
