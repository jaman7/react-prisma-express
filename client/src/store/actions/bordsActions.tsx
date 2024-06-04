import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import HttpService from 'shared/services/http/http.service';
import { IBoard, IBoardTask } from 'store/data.model';
import dataSlice from 'store/dataSlice';

const { boardsSuccess, setIsLoading } = dataSlice.actions;

export const fetchBoards = () => async (dispatch: (arg0: { payload: any; type: any }) => any) => {
  dispatch(setIsLoading(true));
  new HttpService()
    .service()
    .get('/board')
    .then((response: IBoard[] | unknown) => {
      dispatch(boardsSuccess((response as IBoard[]) ?? []));
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      dispatch(setIsLoading(false));
    });
};

export const setNewBoardAction =
  (data: any, dispatchAction: Dispatch<any>) =>
  async (dispatch: (arg0: { payload: any; type: any }) => any): Promise<void> => {
    dispatch(setIsLoading(true));
    return new HttpService()
      .service()
      .post('/board', data)
      .then(() => {
        dispatch(setIsLoading(false));
      })
      .catch(() => {
        dispatch(setIsLoading(false));
      })
      .finally(() => dispatchAction(fetchBoards()));
  };

export const editBoardAction =
  (id: string, data: any, dispatchAction: Dispatch<any>) =>
  async (dispatch: (arg0: { payload: any; type: any }) => any): Promise<void> => {
    console.log(data);
    dispatch(setIsLoading(true));
    new HttpService()
      .service()
      .put(`/board/${id}`, data)
      .catch(() => {
        dispatch(setIsLoading(false));
      })
      .finally(() => dispatchAction(fetchBoards()));
  };

export const deleteBoardAction =
  (id: string, dispatchAction: Dispatch<any>) =>
  async (dispatch: (arg0: { payload: any; type: any }) => any): Promise<void> => {
    dispatch(setIsLoading(true));
    new HttpService()
      .service()
      .delete(`/board/${id}`)
      .then(() => {
        dispatch(setIsLoading(false));
      })
      .catch(() => {
        dispatch(setIsLoading(false));
      })
      .finally(() => dispatchAction(fetchBoards()));
  };

export const sendDragTaskBoardAction =
  (id: string, data: IBoardTask) =>
  async (dispatch: (arg0: { payload: any; type: any }) => any): Promise<void> => {
    // const dispatchAction = useDispatch();
    dispatch(setIsLoading(true));
    new HttpService()
      .service()
      .put(`dragtask/${id}`, data)
      .then(() => {
        dispatch(setIsLoading(false));
      })
      .catch(() => {
        dispatch(setIsLoading(false));
      });
    // .finally(() => dispatchAction(fetchBoards()));
  };

export default { sendDragTaskBoardAction, deleteBoardAction };
