import { SortingFiltersTableEnum } from '../components/table/table.enum';
import { TypeOfEnum } from '../enums/typeof';

const { STRING, NUMBER } = TypeOfEnum;

export const sortByTypes = (
  a: Record<string, string | number>,
  b: Record<string, string | number>,
  sortField?: string,
  order: SortingFiltersTableEnum = SortingFiltersTableEnum.ASC
): number => {
  const aElement = sortField ? a[sortField] : a;
  const bElement = sortField ? b[sortField] : b;

  if (typeof aElement === NUMBER && typeof bElement === NUMBER) {
    return order === SortingFiltersTableEnum.DESC ? Number(bElement) - Number(aElement) : Number(aElement) - Number(bElement);
  }

  if (typeof aElement === STRING && typeof bElement === STRING) {
    return order === SortingFiltersTableEnum.DESC
      ? (bElement as string).localeCompare(aElement as string)
      : (aElement as string).localeCompare(bElement as string);
  }

  return 0;
};
