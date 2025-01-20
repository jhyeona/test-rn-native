import {
  checkBluetoothWithModal,
  checkPermissionWithModal,
  ModalProps,
} from '#permissions/utils/withModalHelper.ts';

export const permissions = async ({setGlobalModalState}: ModalProps, useEscape: boolean) => {
  const isBluetooth = await checkBluetoothWithModal({
    setGlobalModalState,
  });

  const isLocation = await checkPermissionWithModal({
    requestType: useEscape ? 'useEscapeLocation' : 'location',
    setGlobalModalState,
  });
  return {isLocation, isBluetooth};
};
