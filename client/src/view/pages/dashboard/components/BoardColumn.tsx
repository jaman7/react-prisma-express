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
  isOverlay?: boolean;
}

const BoardColumn: React.FC<IBoardColumnProps> = ({ column, tasks, isOverlay }) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id as UniqueIdentifier,
    data: {
      type: 'Column',
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.name}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  } as React.CSSProperties;

  const tasksIds = useMemo(() => {
    return tasks?.map((task) => task.id as UniqueIdentifier) ?? [];
  }, [tasks]);

  return (
    <div ref={setNodeRef} style={style} className="column">
      <div className="column-header p-2 d-flex">
        <span className="text-center w-100">{column.name}</span>
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

// export default BoardColumn;
export default memo(BoardColumn);
