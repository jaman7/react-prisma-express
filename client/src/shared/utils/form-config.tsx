import { IFormElementsConfig, IFormElements, IFormElementsTypes } from '@/shared/components/formElements/FormElements.model';
import { InputTypes } from '../components/input/input.types';
import { IDictionary } from '../components/select/Select.model';

export const createConfigForm = (
  formConfig: IFormElementsConfig,
  params: {
    prefix?: string;
    dictionaries?: IDictionary;
  } = {}
): IFormElements[] => {
  return (
    Object.keys(formConfig)?.map((key: string) => {
      const { prefix, dictionaries } = params || {};
      const { config } = (formConfig[key] as IFormElements) || {};
      const { type, header, placeholder, value, formCellType, dictData, dictName } = config || {};

      const setType = (): InputTypes | undefined => {
        let type: InputTypes | undefined = undefined;
        if (formCellType?.includes('input-')) {
          type = formCellType.replace(/input-/g, '') as InputTypes;
        } else if (!formCellType || formCellType === 'text') {
          type = 'text' as InputTypes;
        } else {
          type = undefined;
        }
        return type;
      };

      const data = {
        formControlName: key,
        type: type ?? setType(),
        config: {
          ...(config ?? {}),
          type: type ?? setType(),
          prefix,
          formCellType: formCellType ?? 'input-text',
          header: header ?? `${prefix}.${key}`,
          placeholder: placeholder ?? `${prefix}.${key}`,
          dictName: dictName ?? key,
          dictData: dictData ?? dictionaries?.[dictName ?? key] ?? [],
          value: value ?? null,
        },
      } as IFormElements;

      if (!data?.type) delete data?.type;
      if (!data?.config?.type) delete data?.config?.type;

      return data;
    }) ?? []
  );
};
