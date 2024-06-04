import { dummyjsonApi } from 'shared/services/api/Api';
import HttpService from 'shared/services/http/http.service';
import { IFakeUsers } from './data.model';
import dataSlice from './dataSlice';
const { fakeUsersSuccess, usersSuccess, setIsLoading } = dataSlice.actions;

export const fetchAvatars = () => async (dispatch: (arg0: { payload: any; type: any }) => any) => {
  new HttpService()
    .service(dummyjsonApi)
    .get('users')
    .then((response: any) => {
      const { users } = response || {};
      const data =
        users?.map(({ id, firstName, lastName, username, email, image }: IFakeUsers) => ({
          id,
          firstName,
          lastName,
          username,
          email,
          image,
        })) ?? [];
      dispatch(fakeUsersSuccess(data));
    })
    .catch(() => {
      dispatch(setIsLoading(false));
    });
};

export const fetchUsers = () => async (dispatch: (arg0: { payload: any; type: any }) => any) => {
  new HttpService()
    .service()
    .get('/users')
    .then((response: any) => {
      dispatch(usersSuccess(response ?? []));
    })
    .catch(() => {
      dispatch(setIsLoading(false));
    });
};
