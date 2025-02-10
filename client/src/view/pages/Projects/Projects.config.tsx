import { ITableColumns } from '@/shared/components/table/table.model';

export const apiProjects = '/api/projects';

export const columnConfig: { [name: string]: ITableColumns } = {
  name: {},
  isActive: { type: 'Boolean', diableFiltrSort: true },
  users: { type: 'UserList', userLogoSize: 24, diableFiltrSort: true },
  countAll: { diableFiltrSort: true },
  countDone: { diableFiltrSort: true },
  countNotDone: { diableFiltrSort: true },
  createdAt: { type: 'DateTime' },
  updatedAt: { type: 'DateTime' },
};

// {
//     "id": "61bf1b67-316c-4cb3-9afe-fb6cc5617521",
//     "name": "Project 1",
//     "description": "Dolorum cupio uterque testimonium defessus unus civitas usitas color viscus.",
//     "isActive": true,
//     "createdAt": "2024-12-12T23:52:42.453Z",
//     "updatedAt": "2024-12-12T23:52:42.453Z",
//     "users": [
//         "Terrance Hoppe",
//         "Alberto Huel",
//         "Nikki Koss",
//         "Penelope Haag",
//         "Arianna Stroman"
//     ],
//     "countAll": 29,
//     "countDone": 3,
//     "countNotDone": 26
// }
