import { Droppable } from '@hello-pangea/dnd';
import { shuffle } from 'lodash';
import { useEffect, useState } from 'react';
import { Card } from './Card';
import { IBoardTask, IColumns } from 'store/data.model';
import { v4 as uuidv4 } from 'uuid';

export const Column = ({ column, statusId, tasks }: { column?: IColumns; statusId?: number; tasks?: IBoardTask[] }) => {
  const [color, setColor] = useState('');
  const colors = ['red', 'orange', 'blue', 'purple', 'green', 'indigo', 'yellow', 'pink', 'skyblue'];
  const statusName = column?.name ?? '';

  useEffect(() => {
    setColor(shuffle?.(colors ?? []).pop() ?? null);
  }, []);

  return (
    <div className="tasks-col">
      <div className="kanban-header">
        <div className={`kanban-header__status ${color}`} />
        {statusName ?? ''} ({tasks?.length ?? 0})
      </div>

      <Droppable droppableId={`${statusId}`}>
        {(droppableProvided, snapshot) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className={`tasks-col-inner ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
          >
            {tasks?.sort((a, b) => a?.position - b?.position)?.map((task: IBoardTask) => <Card key={uuidv4()} task={task} />)}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
