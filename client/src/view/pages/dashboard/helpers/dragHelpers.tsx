import {
  Active,
  closestCorners,
  DataRef,
  DroppableContainer,
  getFirstCollision,
  KeyboardCode,
  KeyboardCoordinateGetter,
  Over,
  UniqueIdentifier,
} from '@dnd-kit/core';

const { Down, Right, Up, Left } = KeyboardCode;

const directions: string[] = [Down, Right, Up, Left];

export const coordinateGetter: KeyboardCoordinateGetter = (
  event,
  { context: { active, droppableRects, droppableContainers, collisionRect } }
) => {
  if (!active || !collisionRect || !directions.includes(event.code as KeyboardCode)) {
    return undefined;
  }

  event.preventDefault();

  const domCollisionRect = new DOMRect(collisionRect.left, collisionRect.top, collisionRect.width, collisionRect.height);

  const filteredContainers = getFilteredContainers(
    Array.from(droppableContainers.values()),
    droppableRects as Map<UniqueIdentifier, DOMRect>,
    active,
    domCollisionRect,
    event.code as KeyboardCode // Cast to KeyboardCode
  );

  const collisions = closestCorners({
    active,
    collisionRect: domCollisionRect,
    droppableRects,
    droppableContainers: filteredContainers,
    pointerCoordinates: null,
  });

  const closestId = getFirstCollision(collisions, 'id');
  if (!closestId) return undefined;

  const newDroppable = droppableContainers.get(closestId);
  const newRect = newDroppable?.rect.current;

  return newRect
    ? {
        x: newRect.left,
        y: newRect.top,
      }
    : undefined;
};

const getFilteredContainers = (
  droppableContainers: DroppableContainer[],
  droppableRects: Map<UniqueIdentifier, DOMRect>,
  active: Active, // Adjusted type
  collisionRect: DOMRect,
  code: KeyboardCode
): DroppableContainer[] => {
  return droppableContainers.filter((entry) => {
    if (!entry || entry.disabled) return false;
    const rect = droppableRects.get(entry.id);
    if (!rect) return false;

    const activeData = active?.data?.current;
    const entryData = entry.data?.current;

    if (entryData?.type === 'Column' && activeData?.type !== 'Column') {
      return false;
    }

    switch (code) {
      case Down:
        return collisionRect.top < rect.top;
      case Up:
        return collisionRect.top > rect.top;
      case Left:
        return collisionRect.left >= rect.left + rect.width;
      case Right:
        return collisionRect.left + collisionRect.width <= rect.left;
      default:
        return false;
    }
  });
};

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<any>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}
