import { Dispatch } from '@reduxjs/toolkit';
import HttpService from '@/core/http/http.service';
import dataSlice from '../dataSlice';
import { IBoard } from '../data.model';

const { setIsLoading, setBoard } = dataSlice.actions;
const httpService = new HttpService();

export const fetchBoard = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  httpService
    .get<IBoard>(`/api/boards/${id}`)
    .then((res) => {
      dispatch(setBoard(res));
      dispatch(setIsLoading(false));
    })
    .catch(() => {
      dispatch(setIsLoading(false));
    });
};
