import { Draggable } from '@hello-pangea/dnd';
import { useSelector } from 'react-redux';
import Button from 'shared/components/Button';
import { IBoardTask } from 'store/data.model';
import { IRootState } from 'store/store';
import TaskEdit from './edit/TaskEdit';
import { useEffect, useState } from 'react';
import { VscOpenPreview } from 'react-icons/vsc';
import { CiCalendarDate } from 'react-icons/ci';
import LazyImage from 'shared/components/LazyImage';

export const Card = ({ task }: { task: IBoardTask }) => {
  const { id, title, taskIdentifier, dateCreated, userId, position } = task || {};
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);

  const boards = useSelector((state: IRootState) => state?.dataSlice?.boards ?? []) ?? [];
  const board = boards.find(board => board?.isActive === true);
  const tasks = board?.tasks ?? [];
  const image = useSelector((state: IRootState) => state?.dataSlice.fakeUsers)?.find(el => el.id === userId)?.image ?? '';
  const taskIndex = tasks?.findIndex(el => el.id === id) ?? null;

  return (
    <>
      <Draggable draggableId={task.id as string} index={position as number}>
        {(provided, snapshot) => (
          <div className="d-block radius-05 mb-2" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <div
              className="card"
              style={{
                opacity: snapshot.isDragging ? 0.9 : 1,
                transform: snapshot.isDragging ? 'rotate(1deg)' : '',
              }}
            >
              <header>{title && <h2 className="card-title">{title}</h2>}</header>
              <section className="card-body">
                <div>
                  <span className="card-taskidentifier">{taskIdentifier}</span>
                </div>

                <div className="card-date">
                  <i className="card-date-icon">
                    <CiCalendarDate />
                  </i>
                  <span className="card-date-txt">{dateCreated}</span>
                </div>

                {image && <LazyImage src={image} alt=" dropdown icon" className="img-fluid lazyload card-avatar" />}

                <Button handleClick={() => setIsTaskModalOpen?.(true)} className="flat filled small ms-2" round={true} tooltip="View">
                  <VscOpenPreview />
                </Button>
              </section>
            </div>
          </div>
        )}
      </Draggable>
      <TaskEdit task={task} setIsTaskModalOpen={setIsTaskModalOpen} isTaskModalOpen={isTaskModalOpen} />
    </>
  );
};
