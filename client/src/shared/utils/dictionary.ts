import { IDictType } from '../components/select/Select.model';
import { SortingFiltersTableEnum } from '../components/table/table.enum';
import { sortByTypes } from './sort-uttils';

const { ASC } = SortingFiltersTableEnum;

export const splitDictByValue = (dict: IDictType[], selectedIds: string[], isSource = true): IDictType[] => {
  return (
    dict
      ?.filter((el) => (isSource ? !selectedIds.includes(el.id as string) : selectedIds.includes(el.id as string)))
      ?.sort((a, b) => sortByTypes(a, b, 'displayName', ASC)) ?? []
  );
};

export const findNameInDictionary = (dict: IDictType[], id: string | number): string | null => {
  return dict?.find((el) => el?.id === id)?.displayName ?? null;
};
