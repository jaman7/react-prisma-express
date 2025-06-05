export interface IFormSortableColumns {
  readonly?: boolean;
  disabled?: boolean;
  defaultValue?: number | string;
}

export interface ISortableColumn {
  id?: string;
  tempId?: string;
  name: string;
  position: number;
  status: string;
  boardId?: string;
  taskCount?: number;
}

export const textAreaConfigDefault = (): IFormSortableColumns => ({
  disabled: false,
  readonly: false,
});
