import { IBoardProject } from '@/store/data.model';
import { IFormPanelValues } from './ProjectsEditModal.model';

export const normalizeProjectData = (res: IBoardProject): IFormPanelValues => ({
  id: res?.id ?? null,
  name: res?.name ?? null,
  description: res?.description ?? null,
  isActive: res?.isActive ?? null,
  columns:
    res?.board?.columns?.map((col) => ({
      ...col,
      name: col.name ?? '',
      position: col.position ?? 0,
      tempId: col.status,
      status: col.status ?? '',
    })) ?? [],
  createdAt: res?.createdAt ? new Date(res.createdAt) : null,
  updatedAt: res?.updatedAt ? new Date(res.updatedAt) : null,
  taskColumnsMoveRules: res?.board?.moveRules?.rules ?? {},
  users: res?.users ?? [],
});
