import { useAuth } from '@/core/auth/userAuth';
import { useEffect, useMemo, useState } from 'react';
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
import { fetchProject$ } from '@/shared/services/ProjectsService';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useNavigate, useParams } from 'react-router-dom';
import { updateTaskPosition$, updateTaskStatus$ } from '@/shared/services/TaskService';
import { findNameInDictionary } from '@/shared/utils/dictionary';
import { toSeoUrlCase } from '@/shared/utils/helpers';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

const Dashboard: React.FC = () => {
  const [activeTask, setActiveTask] = useState<IBoardTask | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const { user = {} } = useAuth() || {};
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const name = useGlobalStore((state) => state?.project?.name ?? '');
  const boardStore = useGlobalStore((state) => state?.project.board);
  const dicts = useGlobalStore((state) => state.dictionary ?? {});

  const board = useMemo(() => (projectId ? boardStore : {}), [boardStore, projectId]);
  const columns: IBoardColumn[] = useMemo(() => board?.columns ?? [], [board?.columns]);
  const tasks: IBoardTask[] = useMemo(() => board?.tasks ?? [], [board?.tasks]);
  const colIds: UniqueIdentifier[] = useMemo(() => board?.columns?.map((col) => col.id as UniqueIdentifier) ?? [], [board?.columns]);

  const { updateProject, setIsLoading } = useGlobalStore();
  const { t } = useFallbackTranslation();

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

  const getData = (projectId: string) => {
    if (!projectId) return;
    const subscription = fetchProject$(projectId).subscribe((res) => {
      updateProject(res);
    });
    return () => subscription.unsubscribe();
  };

  useEffect(() => {
    if (user?.id && user?.activeProjectId && !projectId) {
      const name = findNameInDictionary(dicts?.userProjectsDict, user?.activeProjectId);
      if (!name) return;
      const targetUrl = `/project/${toSeoUrlCase(name)}/${user?.activeProjectId}`;
      navigate(targetUrl);
    } else if (user?.id && projectId) {
      getData(projectId);
    } else if (!projectId) {
      navigate(`/`);
    }
  }, [user?.id, projectId, dicts?.userProjectsDict]);

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

  const handleDragCancel = () => {
    setActiveTask(null);
    setOverColumnId(null);
  };

  const setActivecolumnId = (columnId: string, columnStatus: string, taskStatus: string) => {
    const isMoveAllowed = (board?.moveRules?.rules?.[taskStatus]?.indexOf(columnStatus) ?? -1) > -1;
    setOverColumnId(isMoveAllowed ? columnId : null);
  };

  const handleDragMove = ({ active, over }: DragMoveEvent) => {
    const columnStatus: string = over?.data.current?.column?.status;
    const taskStatus: string = active?.data.current?.task?.status;
    setActivecolumnId(over?.id as string, columnStatus, taskStatus);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const columnStatus: string = over?.data.current?.column?.status;
    const taskStatus: string = active?.data.current?.task?.status;
    setActivecolumnId(over?.id as string, columnStatus, taskStatus);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    setOverColumnId(null);
    if (!active || !over || !hasDraggableData(active)) return;

    const board = useGlobalStore.getState().project.board;
    const task = active?.data?.current?.task as IBoardTask;
    const taskStatus = task?.status as string;

    let newColumnId = task.columnId;
    let targetCol: IBoardColumn | undefined;

    const overData = over.data.current;

    if (overData?.type === 'Task') {
      const overTask = overData.task as IBoardTask;
      newColumnId = overTask.columnId;
    } else if (overData?.type === 'Column') {
      const overColumn = overData.column as IBoardColumn;
      newColumnId = overColumn.id;
    }

    targetCol = board?.columns?.find((col) => col.id === newColumnId);
    const isMoveAllowed = (board?.moveRules?.rules?.[taskStatus]?.indexOf(targetCol?.status as string) ?? -1) > -1;
    if (!task || !targetCol || !isMoveAllowed) return;

    const isSameColumn = task.columnId === newColumnId;

    if (isSameColumn) {
      const reorderedTasks = [...(board?.tasks ?? [])]
        .filter((t) => t.columnId === task.columnId && t.id !== task.id)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

      const overIndex = reorderedTasks.findIndex((t) => t.id === over.id);
      const newPosition = overIndex >= 0 ? overIndex + 1 : reorderedTasks.length + 1;

      useGlobalStore.getState().updateTaskPositionInStore(task.id!, newPosition);

      const subscription = updateTaskPosition$(activeTask?.id as string, { position: newPosition }).subscribe(() => {
        getData(projectId as string);
      });
      return () => subscription.unsubscribe();
    } else {
      useGlobalStore.getState().updateTaskInProjectBoard({
        ...task,
        status: targetCol.status,
        columnId: targetCol.id,
        updatedAt: new Date().toISOString(),
      });

      const subscription = updateTaskStatus$(activeTask?.id as string, { status: targetCol.status, columnId: targetCol.id }).subscribe(
        () => {
          getData(projectId as string);
        }
      );
      return () => subscription.unsubscribe();
    }
  };

  return (
    <div className="d-flex flex-column gap-3 w-100">
      <h2 className="title">{t('title', { value: name })}</h2>
      <DndContext
        sensors={sensors}
        accessibility={{
          announcements,
        }}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
      >
        <div className="board">
          {colIds?.length > 0 && (
            <SortableContext items={colIds}>
              {columns?.map((col) => (
                <BoardColumn
                  key={col.id}
                  column={col}
                  tasks={tasks?.filter((task) => task.columnId === col.id)?.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) ?? []}
                  isTarget={overColumnId === col.id}
                />
              ))}
            </SortableContext>
          )}
        </div>

        {'document' in window &&
          createPortal(<DragOverlay>{activeTask && <TaskCard task={activeTask} isOverlay />}</DragOverlay>, document.body)}
      </DndContext>
    </div>
  );
};

export default Dashboard;
