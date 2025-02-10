import { useNavigate } from 'react-router-dom';

export const getChangedValues = <T extends Record<string, any>>(values: T, initialValues: T) => {
  return Object.entries(values).reduce((acc: Partial<T>, [key, value]) => {
    const hasChanged = initialValues[key as keyof T] !== value;
    if (hasChanged) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {});
};

export const toCamelCase = (text: string): string => {
  const tmpText = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
  return tmpText.substring(0, 1).toLowerCase() + tmpText.substring(1);
};

export const arrayMove = (arr: any[], oldIndex: number, newIndex: number): any[] => {
  if (newIndex >= arr?.length) {
    var k = newIndex - arr?.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr?.splice(newIndex, 0, arr?.splice(oldIndex, 1)[0]);
  return arr;
};

export const handleRedirect = (path: string) => {
  const nawigate = useNavigate();
  nawigate(path);
};
