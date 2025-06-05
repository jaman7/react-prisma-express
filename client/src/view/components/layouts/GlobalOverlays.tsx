import { Tooltip } from 'primereact/tooltip';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { useGlobalStore } from '@/store/useGlobalStore';
import { createPortal } from 'react-dom';
import Loader from '@/shared/components/Loader';
import { Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';

const GlobalOverlays = () => {
  const isLoading = useGlobalStore((state) => state.isLoading) ?? false;

  const toastRef = useRef<Toast | null>(null);

  useEffect(() => {
    if (toastRef.current) {
      useGlobalStore.getState()?.setToastRef(toastRef as React.RefObject<Toast>);
    }
  }, []);

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <Tooltip target=".target-tooltip" />
      <ConfirmPopup />
      {isLoading && typeof document !== 'undefined' && createPortal(<Loader />, document.body)}
    </>
  );
};

export default GlobalOverlays;
