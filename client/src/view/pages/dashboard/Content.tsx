import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'store/store';
import { DragDropContext, DropResult, OnDragEndResponder } from '@hello-pangea/dnd';
import { IBoardTask } from 'store/data.model';
import { Column } from '../../components/Column';
import boardsSlice from 'store/dataSlice';
import { useEffect } from 'react';
import { IDictType } from 'shared/components/select/Select.model';
import { sendDragTaskBoardAction } from 'store/actions/bordsActions';

const Content = () => {
  const dispatchAction = useDispatch();
  const boards = useSelector((state: IRootState) => state?.dataSlice?.boards ?? []);
  const board = boards.find(board => board.isActive === true) || {};
  const columns = board?.columns?.map(el => el)?.sort((a, b) => (a?.position as number) - (b?.position as number));

  const taksByStatus = (status: number): IBoardTask[] => board?.tasks?.filter(el => el?.status === status) ?? [];

  const getTargetIndex = (index: number, sourceStatus: string, targetStatus: string) => {
    const sourceStatusesId = +sourceStatus;
    const targetStatusesId = +targetStatus;
    if (sourceStatusesId < targetStatusesId) {
      return index - 1;
    } else {
      return index;
    }
  };

  useEffect(() => {
    dispatchAction(
      boardsSlice.actions.setDict({
        columnsDict: columns?.map(el => ({
          ...el,
          displayName: el.name,
        })) as IDictType[],
      })
    );
  }, [columns]);

  const onDragEnd: OnDragEndResponder = (result: DropResult) => {
    const { destination, source, draggableId: taskId } = result || {};
    const { droppableId: sourceStatusId = '0' } = source || {};
    const { droppableId: targetStatusId = '0' } = destination || {};

    if (!destination || (targetStatusId === sourceStatusId && destination?.index === source?.index)) {
      return;
    } else {
      const task = board?.tasks?.find(el => el?.id === taskId) ?? {};

      dispatchAction(
        boardsSlice.actions.dragTask({
          taskId,
          status: +targetStatusId as number,
          oldTaskIndex: source?.index as number,
          newtaskIndex: destination?.index as number,
        })
      );
      dispatchAction(sendDragTaskBoardAction(task?.id as string, { ...task, status: +targetStatusId as number }));
    }
  };

  return (
    <div className="dasboard-content container-fluid">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban">
          {columns?.map(column => (
            <Column
              column={column}
              statusId={column?.position as number}
              tasks={taksByStatus?.(column.position as number)}
              key={column.id}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Content;
