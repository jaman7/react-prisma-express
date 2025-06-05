import { useSortable } from '@dnd-kit/sortable';
import { FC, useEffect, useRef, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { ISortableColumn } from './FormSortableColumns.model';
import { FaRegTrashCan } from 'react-icons/fa6';
import Button, { ButtonVariant } from '../button/Button';
import DragIcon from '../icons/DragIcon';
import { normalizeStatus } from './FormSortableColumns.helper';
import classNames from 'classnames';

interface ColumnItemProps {
  column: ISortableColumn;
  existingStatuses: string[];
  onNameChange: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  focusedId?: string | null;
  setFocusedId?: (id: string | null) => void;
  disabled?: boolean;
}

const ColumnItem: FC<ColumnItemProps> = ({ column, existingStatuses, onNameChange, onDelete, focusedId, setFocusedId, disabled }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(column.name ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, setActivatorNodeRef } = useSortable({
    id: column.tempId!,
    transition: {
      duration: 250,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleChange = (newName: string) => {
    setLocalValue(newName);
  };

  const confirmEdit = () => {
    const newStatus = normalizeStatus(localValue);
    if (existingStatuses.includes(newStatus) && newStatus !== column.status) return;
    onNameChange(column.tempId!, localValue);
    setIsEditing(false);
    setFocusedId?.(null);
  };

  useEffect(() => {
    if (focusedId === column.tempId) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [focusedId]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      confirmEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setFocusedId?.(null);
      setLocalValue(column.name ?? '');
    }
  };

  const containerClass = classNames('sortable-columns__sortable--item', {
    disabled: disabled,
  });

  return (
    <div ref={setNodeRef} style={style} {...(disabled ? {} : attributes)} className={containerClass}>
      {!disabled && (
        <i ref={setActivatorNodeRef} {...listeners} {...attributes}>
          <DragIcon />
        </i>
      )}

      {isEditing && !disabled ? (
        <input
          ref={inputRef}
          className="sortable-columns__sortable--item__input"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={confirmEdit}
          placeholder="Nazwa kolumny"
        />
      ) : (
        <span className="sortable-columns__sortable--item__value" onClick={() => setFocusedId?.(column.tempId!)}>
          {column.name || <i className="text-muted">(kliknij, aby edytować)</i>}
        </span>
      )}

      {!disabled && (
        <Button handleClick={() => onDelete?.(column?.tempId as string)} variant={ButtonVariant.ROUND} size="xs" tooltip="Usuń">
          <FaRegTrashCan />
        </Button>
      )}
    </div>
  );
};

export default ColumnItem;
