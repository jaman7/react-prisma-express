import HttpService from 'shared/services/http/http.service';
import dataSlice from 'store/dataSlice';

const { setIsLoading, usersSuccess } = dataSlice.actions;
const httpService = new HttpService();

export const fetchUsers = () => async (dispatch: (arg0: { payload: any; type: any }) => any) => {
  dispatch(setIsLoading(true));
  httpService
    .service()
    .get('api/users')
    .then((response: any) => {
      dispatch(usersSuccess(response ?? {}));
      dispatch(setIsLoading(false));
    })
    .catch(() => {
      dispatch(setIsLoading(false));
    });
};
