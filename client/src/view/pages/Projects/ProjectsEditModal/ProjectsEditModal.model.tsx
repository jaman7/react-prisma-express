export interface IFormPanelValues {
  id: string | number | null;
  name: string | null;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  isActive: boolean | null;
  columns?: {
    id?: string;
    name: string;
    position: number;
    status: string;
    boardId?: string;
  }[];
  taskColumnsMoveRules: Record<string, string[]>;
  users: string[] | null;
}
