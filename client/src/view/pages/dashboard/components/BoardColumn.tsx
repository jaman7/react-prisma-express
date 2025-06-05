import { IBoardColumn, IBoardTask } from '@/store/data.model';
import { UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import { memo, useMemo } from 'react';
import TaskCard from './TaskCard';

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: IBoardColumn;
}

interface IBoardColumnProps {
  column: IBoardColumn;
  tasks: IBoardTask[];
  isTarget?: boolean;
}

const BoardColumn: React.FC<IBoardColumnProps> = ({ column, tasks, isTarget }) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id as UniqueIdentifier,
    data: {
      type: 'Column',
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.name}`,
    },
    transition: {
      duration: 250, // milliseconds
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  } as React.CSSProperties;

  const columnClass = classNames('column', {
    'column-highlight': isTarget, // ✅ klasa CSS do podświetlenia
  });

  const tasksIds = useMemo(() => {
    return tasks?.map((task) => task.id as UniqueIdentifier) ?? [];
  }, [tasks]);

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={columnClass}>
      <div className="column-header p-2 d-flex flex-column">
        <span className="text-center w-100">{column.name}</span>
        <span className="text-center w-100">{column.id}</span>
      </div>
      <div className="column-body">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default memo(BoardColumn);
