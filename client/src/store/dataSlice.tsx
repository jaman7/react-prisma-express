import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IBoard, IData, IFakeUsers, IUser } from './data.model';
import { arrayMove } from 'shared/utils/helpers';
import { IDictionary } from 'shared/components/select/Select.model';

const initialState: IData = {
  isSideBarOpen: false,
  isLoading: false,
  error: false,
  boards: [],
  fakeUsers: [],
  users: [],
  user: {},
  dict: {},
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setDict: (state, action: PayloadAction<IDictionary>) => {
      state.dict = action?.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action?.payload;
    },
    setIsSideBarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSideBarOpen = action?.payload;
    },
    usersSuccess: (state, action: PayloadAction<IUser[]>) => {
      state.users = action?.payload ?? [];
    },
    setUserData: (state, action: PayloadAction<string>) => {
      state.user = { ...(state?.users?.find(user => user.email === action?.payload) ?? {}), dateSync: new Date().toISOString() };
    },
    clearStore: state => {
      state = initialState;
    },
    fakeUsersSuccess: (state, action: PayloadAction<IFakeUsers[]>) => {
      state.fakeUsers = action?.payload ?? [];
    },
    boardsSuccess: (state, action: PayloadAction<IBoard[]>) => {
      state.boards = action?.payload ?? [];
    },
    addBoard: (state, action: PayloadAction<IBoard>) => {
      const isActive = (state?.boards?.length ?? 0) > 0 ? false : true;
      const payload = action.payload;
      const board = {
        name: payload.name,
        isActive,
        tasks: [],
      };
      board.tasks = payload.tasks;
      state?.boards?.push(board);
    },
    editBoard: (state, action) => {
      const payload = action?.payload;
      const board = state?.boards?.find(board => board.isActive) || {};
      board.name = payload?.name ?? '';
      board.tasks = payload?.tasks ?? [];
    },
    deleteBoard: (state, action) => {
      const board = state?.boards?.find(board => board.id === action?.payload.id) || {};
      state?.boards?.splice(state?.boards.indexOf(board), 1);
    },
    setBoardActive: (state, action) => {
      state?.boards?.map((board, index) => {
        index === action?.payload?.index ? (board.isActive = true) : (board.isActive = false);
        return board;
      });
    },
    addTask: (state, action) => {
      const { title, status, description, subtasks, newColIndex } = action?.payload || {};
      const task = { title, description, subtasks, status };
      const board = state?.boards?.find(board => board.isActive) || {};
      const column = board?.columns?.find((_, index) => index === newColIndex) || {};
      column?.tasks.push(task);
    },
    editTask: (state, action) => {
      const { title, status, description, subtasks, prevColIndex, newColIndex, taskIndex } = action?.payload || {};
      const board = state?.boards?.find(board => board.isActive) || {};
      const column = board?.columns?.find((_, index) => index === prevColIndex) || {};
      const task = column?.tasks?.find((_, index) => index === taskIndex) || {};
      task.title = title;
      task.status = status;
      task.description = description;
      task.subtasks = subtasks;
      if (prevColIndex === newColIndex) return;
      column.tasks = column?.tasks?.filter((_, index) => index !== taskIndex) || {};
      const newCol = board?.columns?.find((_, index) => index === newColIndex) || {};
      newCol.tasks.push(task);
    },
    dragTask: (state, action) => {
      const { taskId, oldTaskIndex, newtaskIndex, status } = action?.payload || {};
      const board = state?.boards?.find(board => board.isActive) ?? {};
      const columns = board?.columns ?? [];
      const newStatus = columns?.find(el => el.position === status)?.position ?? null;
      const tasks = arrayMove(
        board?.tasks?.map(el => (el.id === +taskId ? { ...el, status: newStatus } : el)) ?? [],
        oldTaskIndex,
        newtaskIndex
      );
      const newTasks = tasks?.map(el => {
        if (el.id === +taskId) {
          return { ...el, status: newStatus };
        } else {
          return el;
        }
      });
      board.tasks = newTasks;
    },
    setSubtaskCompleted: (state, action) => {
      const payload = action?.payload;
      const board = state?.boards?.find(board => board.isActive) || {};
      const col = board?.columns?.find((_, i) => i === payload.colIndex) || {};
      const task = col?.tasks?.find((_, i) => i === payload.taskIndex) || {};
      const subtask = task?.subtasks?.find((_, i) => i === payload.index) || {};
      subtask.isCompleted = !subtask?.isCompleted;
    },
    setTaskStatus: (state, action) => {
      const payload = action.payload;
      const board = state?.boards?.find(board => board.isActive) || {};
      const columns = board?.columns ?? [];
      const col = columns?.find((_, i) => i === payload.colIndex) || {};
      if (payload.colIndex === payload.newColIndex) return;
      const task = col?.tasks?.find((_, i) => i === payload.taskIndex) || {};
      task.status = payload?.status;
      col.tasks = col?.tasks?.filter((_, i) => i !== payload.taskIndex) ?? [];
      const newCol = columns?.find((_, i) => i === payload.newColIndex) || {};
      newCol.tasks.push(task);
    },
    deleteTask: (state, action) => {
      const payload = action.payload;
      const board = state?.boards?.find(board => board.isActive) || {};
      const col = board?.columns?.find((_, i) => i === payload.colIndex) || {};
      col.tasks = col?.tasks?.filter((_, i) => i !== payload.taskIndex) ?? [];
    },
  },
});

export default dataSlice;
