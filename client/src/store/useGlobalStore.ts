import { IDictionaries } from '@/shared/model/dictionary';
import { create } from 'zustand';
import { IBoardProject, IBoardTask } from './data.model';
import { Toast } from 'primereact/toast';

type IGlobalState = {
  isSideBarOpen: boolean;
  isLoading: boolean;
  error: boolean;
  project: IBoardProject;
  dictionary: IDictionaries;
  toastRef: React.RefObject<Toast> | null;
  updateProject: (data: IBoardProject) => void;
  updateTaskInProjectBoard: (updatedTask: IBoardTask) => void;
  updateTaskPositionInStore: (taskId: string, newPosition: number) => void;
  updateDictionary: (data: Partial<IDictionaries>) => void;
  clearStore: () => void;
  setIsSideBarOpen: () => void;
  setIsLoading: (state: boolean) => void;
  setToastRef: (ref: React.RefObject<Toast>) => void;
};

export const useGlobalStore = create<IGlobalState>((set) => ({
  isSideBarOpen: false,
  isLoading: false,
  error: false,
  project: {},
  dictionary: {} as IDictionaries,
  toastRef: null,
  updateProject: (data) =>
    set((state) => {
      return { project: { ...state.project, ...data } as IBoardProject };
    }),
  updateTaskInProjectBoard: (updatedTask) =>
    set((state) => {
      const tasks = state.project.board?.tasks?.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task));
      return {
        project: {
          ...state.project,
          board: {
            ...state.project.board,
            tasks,
          },
        },
      };
    }),
  updateTaskPositionInStore: (taskId, newPosition) =>
    set((state) => {
      const tasks = state.project.board?.tasks?.map((task) => (task.id === taskId ? { ...task, position: newPosition } : task));
      return {
        project: {
          ...state.project,
          board: {
            ...state.project.board,
            tasks,
          },
        },
      };
    }),
  updateDictionary: (data) =>
    set((state) => {
      return { dictionary: { ...state.dictionary, ...data } as IDictionaries };
    }),
  clearStore: () =>
    set(() => ({
      isSideBarOpen: false,
      isLoading: false,
      dictionary: {} as IDictionaries,
    })),
  setIsSideBarOpen: () =>
    set((state) => {
      return { isSideBarOpen: !state.isSideBarOpen };
    }),
  setIsLoading: (state) =>
    set(() => {
      return { isLoading: state };
    }),
  setToastRef: (ref) => set({ toastRef: ref }),
}));
