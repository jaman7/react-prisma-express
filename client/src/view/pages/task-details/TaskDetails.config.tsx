import { IFormElementsConfig } from '@/shared/components/formElements/FormElements.model';
import * as yup from 'yup';

export const apiTasks = '/api/tasks';

export const formConfig: IFormElementsConfig = {
  title: { config: { placeholder: 'np. Promocje', header: 'Nazwa' } },
  description: { config: { formCellType: 'text-editor', placeholder: 'Wklej lub wyszukaj', header: 'Link' } },
  statusId: { config: { formCellType: 'select', dictName: 'columnDict', placeholder: 'np. Promocje', header: 'Nazwa' } },
};

export const schema = yup.object({
  title: yup.string().required('Nazwa jest wymagana').max(100, 'Nazwa nie może przekraczać 100 znaków'),
  description: yup.string().required('Description is required'),
  status: yup.string(),
});
