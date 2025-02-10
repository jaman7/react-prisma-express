import { useAuth } from '@/core/auth/userAuth';
import { useEffect, useMemo, useState } from 'react';
import { AppDispatch, IRootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoard } from '@/store/actions/boardsActions';
import {
  Announcements,
  closestCenter,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { coordinateGetter, hasDraggableData } from './helpers/dragHelpers';
import { createPortal } from 'react-dom';
import { measuring } from './helpers/dragHelpers.const';
import { SortableContext } from '@dnd-kit/sortable';
import { IBoardColumn, IBoardTask } from '@/store/data.model';
import BoardColumn from './components/BoardColumn';
import TaskCard from './components/TaskCard';

const Dashboard: React.FC = () => {
  const [activeTask, setActiveTask] = useState<IBoardTask | null>(null);
  const { user = {} } = useAuth() || {};
  const board = useSelector((state: IRootState) => state?.dataSlice?.board ?? {});
  const dispatch = useDispatch<AppDispatch>();
  const columns: IBoardColumn[] = useMemo(() => board?.columns ?? [], [board.columns]);
  const tasks: IBoardTask[] = useMemo(() => board?.tasks ?? [], [board.tasks]);
  const colIds: UniqueIdentifier[] = useMemo(() => board?.columns?.map((col) => col.id as UniqueIdentifier) ?? [], [board.columns]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  useEffect(() => {
    if (user?.activeBoardId) dispatch(fetchBoard(user.activeBoardId));
  }, [user?.activeBoardId]);

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up item ${active.id}.`,
    onDragOver: ({ active, over }) =>
      over ? `Dragging item ${active.id} over ${over.id}.` : `Dragging item ${active.id} with no valid drop target.`,
    onDragEnd: ({ active, over }) => `Dropped item ${active.id} ${over ? `on ${over.id}` : ''}.`,
    onDragCancel: ({ active }) => `Canceled dragging item ${active.id}.`,
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event || {};
    if (!hasDraggableData(active)) return;
    const data = active.data.current;
    if (data?.type === 'Task') {
      setActiveTask(data.task);
      return;
    }
  };
  // const handleDragMove = ({ delta }: DragMoveEvent) => {};
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
  };
  const handleDragOver = ({ over }: DragOverEvent) => {};
  // const handleDragCancel = () => {};

  return (
    <>
      <DndContext
        sensors={sensors}
        accessibility={{
          announcements,
        }}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        // onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        // onDragCancel={handleDragCancel}
      >
        <div className="board">
          {colIds?.length > 0 && (
            <SortableContext items={colIds}>
              {columns?.map((col) => <BoardColumn key={col.id} column={col} tasks={tasks.filter((task) => task.columnId === col.id)} />)}
            </SortableContext>
          )}
        </div>

        {'document' in window &&
          createPortal(
            <DragOverlay>
              {/* <BoardColumn key={col.id} isOverlay column={col} tasks={tasks.filter((task) => task.columnId === col.id)} /> */}
              {activeTask && <TaskCard task={activeTask} isOverlay />}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </>
  );
};

export default Dashboard;
