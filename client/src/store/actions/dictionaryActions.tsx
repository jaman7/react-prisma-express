import HttpService from '@/core/http/http.service';
import dataSlice from '../dataSlice';
import { IDictType } from '@/shared/components/select/Select.model';
import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';

const { setIsLoading, addDict } = dataSlice.actions;
const httpService = new HttpService();

export const fetchDictionary = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  axios
    .all([
      httpService.get<IDictType[]>(`/api/users/dictionary`),
      httpService.get<IDictType[]>('/api/projects/dictionary'),
      httpService.get<IDictType[]>(`/api/boards/dictionary/user/${id}`),
    ])
    .then(([users, projects, boards]) => {
      if (users && projects && boards) {
        dispatch(addDict({ projectsDict: projects ?? [], boardsByUserDict: boards ?? [], users: users ?? [] }));
        dispatch(setIsLoading(false));
      }
    })
    .catch(() => {
      dispatch(setIsLoading(false));
    });
};
