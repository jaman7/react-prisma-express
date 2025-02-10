import express from 'express';
import { deserializeUser } from '@/middleware/deserializeUser';
import { requireUser } from '@/middleware/requireUser';
import { validateQueryParams } from '@/middleware/queryValidator';
import {
  createProjectHandler,
  getProjectHandler,
  getProjectsHandler,
  updateProjectHandler,
  deleteProjectHandler,
  getProjectsDictionaryHandler,
  getUserProjectsDictionaryHandler,
} from './projects.controller';
import { createProjectSchema, updateProjectSchema } from './projects.schema';
import { validate } from '@/middleware/validate';

const projectsRouter = express.Router();

projectsRouter.use(deserializeUser, requireUser);

// Specific routes first
projectsRouter.get('/dictionary', getProjectsDictionaryHandler);
projectsRouter.get('/dictionary/user/:userId', getUserProjectsDictionaryHandler);

// Dynamic routes next
projectsRouter.get('/:id', getProjectHandler);
projectsRouter.post('/', validate(createProjectSchema), createProjectHandler);
projectsRouter.put('/:id', validate(updateProjectSchema), updateProjectHandler);
projectsRouter.delete('/:id', deleteProjectHandler);

// Other specific routes
projectsRouter.get('/', validateQueryParams, getProjectsHandler);

export default projectsRouter;
