import express from 'express';
import { deserializeUser } from '@/middleware/deserializeUser';
import { requireUser } from '@/middleware/requireUser';
import { validateQueryParams } from '@/middleware/queryValidator';
import { createProjectSchema, updateProjectSchema } from './projects.schema';
import { validate } from '@/middleware/validate';
import { getProjectsUserHandler } from './controllers/getProjectsUserHandler';
import { getProjectsHandler } from './controllers/getProjectsHandler';
import { getProjectHandler } from './controllers/getProjectHandler';
import { createProjectHandler } from './controllers/createProjectHandler';
import { updateProjectHandler } from './controllers/updateProjectHandler';
import { getProjectUsersAssignHandler } from './controllers/getProjectUsersAssignHandler';
import { getProjectsDictionaryHandler } from './controllers/getProjectsDictionaryHandler';
import { getUserProjectsDictionaryHandler } from './controllers/getUserProjectsDictionaryHandler';
import { updateProjectUsersAssignHandler } from './controllers/updateProjectUsersAssignHandler';
import { deleteOrArchiveProjectHandler } from './controllers/deleteOrArchiveProjectHandler';

const projectsRouter = express.Router();

projectsRouter.use(deserializeUser, requireUser);

// Specific routes first
projectsRouter.get('/dictionary', getProjectsDictionaryHandler);
projectsRouter.get('/dictionary/user/:userId', getUserProjectsDictionaryHandler);

// Dynamic routes next
projectsRouter.get('/user/:userId', getProjectsUserHandler);
projectsRouter.get('/:id', getProjectHandler);
projectsRouter.post('/', validate(createProjectSchema), createProjectHandler);
projectsRouter.put('/:id', validate(updateProjectSchema), updateProjectHandler);
projectsRouter.delete('/:id', deleteOrArchiveProjectHandler);

projectsRouter.get('/users/:projectId', getProjectUsersAssignHandler);
projectsRouter.put('/users/:projectId', updateProjectUsersAssignHandler);

// Other specific routes
projectsRouter.get('/', validateQueryParams, getProjectsHandler);

export default projectsRouter;
