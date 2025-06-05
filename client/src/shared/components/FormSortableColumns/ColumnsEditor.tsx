import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ColumnItem from './ColumnItem';
import { ISortableColumn } from './FormSortableColumns.model';
import { normalizeStatus } from './FormSortableColumns.helper';

export interface ChildRefHandle {
  handleHistoryUndo: () => void;
  handleAddColumn: () => void;
}

interface ColumnsEditorProps {
  columns: ISortableColumn[];
  onUpdate: (columns: ISortableColumn[]) => void;
  history: ISortableColumn[][];
  setHistory: (history: ISortableColumn[][]) => void;
  disabled?: boolean;
}

const ColumnsEditor = forwardRef<ChildRefHandle, ColumnsEditorProps>(({ columns, onUpdate, history, setHistory, disabled }, ref) => {
  const [items, setItems] = useState(columns.sort((a, b) => a.position - b.position));
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setItems(columns.sort((a, b) => a.position - b.position));
  }, [columns]);

  const syncUpdate = (updated: ISortableColumn[]) => {
    setHistory?.([...(history ?? []), items ?? []] as ISortableColumn[][]);
    setItems(updated);
    onUpdate(updated);
  };

  useImperativeHandle(ref, () => ({
    handleHistoryUndo,
    handleAddColumn,
  }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items?.findIndex((i) => i.tempId === active.id);
    const newIndex = items?.findIndex((i) => i.tempId === over.id);
    const newItems =
      arrayMove(items, oldIndex, newIndex)?.map((item, idx) => ({
        ...item,
        position: idx + 1,
      })) ?? [];

    syncUpdate(newItems);
  };

  const handleNameChange = (id: string, newName: string) => {
    const newStatus = normalizeStatus(newName);
    const updated =
      items?.map((item) => (item.tempId === id ? { ...item, name: newName, status: newStatus, tempId: newStatus } : item)) ?? [];
    syncUpdate(updated);
  };

  const handleDelete = (id: string) => {
    const updated =
      items
        ?.filter((item) => item.tempId !== id)
        ?.map((item, idx) => ({
          ...item,
          position: idx + 1,
        })) ?? [];
    syncUpdate(updated);
  };

  const handleHistoryUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setItems(prev);
    onUpdate(prev);
  };

  const handleAddColumn = () => {
    const newId = uuidv4();
    const newColumn: ISortableColumn = {
      tempId: newId,
      name: '',
      status: '',
      position: items.length + 1,
      taskCount: 0,
    };
    const updated = [...items, newColumn];
    syncUpdate(updated);
    setFocusedId(newId);
  };

  const existingStatuses = useMemo(() => items.map((i) => i.status), [items]);

  return (
    <div className="sortable-columns__sortable">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={disabled ? undefined : handleDragEnd}
        modifiers={disabled ? [] : [restrictToVerticalAxis]}
      >
        <SortableContext items={items?.map((i) => i.tempId!)} strategy={verticalListSortingStrategy}>
          {items?.map((col, index) => (
            <ColumnItem
              key={`columnItem-${index}-${col.tempId}`}
              column={col}
              existingStatuses={existingStatuses}
              onNameChange={handleNameChange}
              onDelete={handleDelete}
              focusedId={focusedId}
              setFocusedId={setFocusedId}
              disabled={disabled}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
});

export default ColumnsEditor;
