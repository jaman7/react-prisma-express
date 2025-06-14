import Button, { ButtonVariant } from '@/shared/components/button/Button';
import DragIcon from '@/shared/components/icons/DragIcon';
import LetteredAvatar from '@/shared/components/LetteredAvatar';
import { DATE_TIME_FORMAT } from '@/shared/enums';
import { IBoardTask } from '@/store/data.model';
import { useGlobalStore } from '@/store/useGlobalStore';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import { format } from 'date-fns';
import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface IProps {
  task: IBoardTask;
  isOverlay?: boolean;
}

export type TaskType = 'Task';

export interface TaskDragData {
  type: TaskType;
  task: IBoardTask;
}

const TaskCard: React.FC<IProps> = ({ task, isOverlay }) => {
  const navigate = useNavigate();
  const dict = useGlobalStore((state) => state.dictionary ?? {});
  const { setNodeRef, attributes, listeners, transform, transition, isDragging, setActivatorNodeRef } = useSortable({
    id: task.id as UniqueIdentifier,
    data: {
      type: 'Task',
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: 'Task',
    },
    transition: {
      duration: 250, // milliseconds
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const handleMoreClick = (taskId: string) => {
    navigate(`/boards/${task.boardId}/tasks/${taskId}`);
  };

  const styleBase = {
    transition,
    transform: CSS.Translate.toString(transform),
  } as React.CSSProperties;

  const taskCardClass = classNames('task', {
    'opacity-50': isDragging,
    'border-blue': isOverlay,
  });

  const userName = useMemo(() => {
    return dict?.usersDict?.find((el) => el.id === task?.userId)?.displayName ?? '';
  }, [task, dict?.usersDict]);

  const formattedCreatedAt = useMemo(() => {
    return task?.createdAt ? format(new Date(task.createdAt), DATE_TIME_FORMAT.FNS_DATE_TIME_NO_SEC) : 'N/A';
  }, [task?.createdAt]);

  const formattedUpdatedAt = useMemo(() => {
    return task?.updatedAt ? format(new Date(task.updatedAt), DATE_TIME_FORMAT.FNS_DATE_TIME_NO_SEC) : 'N/A';
  }, [task?.updatedAt]);

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={styleBase} className={taskCardClass}>
      <div className="task-header">
        <i ref={setActivatorNodeRef} {...attributes} {...listeners}>
          <DragIcon />
        </i>
        <span>{task.title}</span>
      </div>

      <div className="task-body">
        <p className="date">createdAt: {formattedCreatedAt}</p>
        <p className="date">updatedAt: {formattedUpdatedAt}</p>
        <p className="status">{task.status}</p>
        <p className="status">{task.id}</p>
      </div>

      <div className={classNames('task-footer', { 'justify-content-end': !userName })}>
        {userName && <LetteredAvatar name={userName ?? ''} size={25} tooltipText={userName} />}

        <Button
          handleClick={() => {
            handleMoreClick(task.id as string);
          }}
          variant={ButtonVariant.PRIMARY}
          size="xs"
        >
          more
        </Button>
      </div>
    </div>
  );
};

export default memo(TaskCard);
