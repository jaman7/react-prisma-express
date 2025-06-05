import { useGlobalStore } from '@/store/useGlobalStore';

export const showToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail?: string) => {
  const toastRef = useGlobalStore.getState().toastRef;
  toastRef?.current?.show({
    severity,
    summary,
    detail,
    life: 3000,
  });
};
