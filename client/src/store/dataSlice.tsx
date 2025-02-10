import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IBoard, IData } from './data.model';
import { IDictionary } from '@/shared/components/select/Select.model';

const initialState: IData = {
  isSideBarOpen: false,
  isLoading: false,
  error: false,
  dict: {},
  board: {},
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<IBoard>) => {
      state.board = { ...state.board, ...action?.payload };
    },
    setAllDict: (state, action: PayloadAction<IDictionary>) => {
      state.dict = action?.payload;
    },
    addDict: (state, action: PayloadAction<IDictionary>) => {
      state.dict = { ...state.dict, ...action?.payload };
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action?.payload;
    },
    setIsSideBarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSideBarOpen = action?.payload;
    },
    clearStore: (state) => {
      state = initialState;
    },
  },
});

export default dataSlice;
