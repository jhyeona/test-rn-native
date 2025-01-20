import {SetterOrUpdater} from 'recoil';

import {bluetoothEnabled} from '#containers/DailySchedules/utils/modalHelper.ts';
import {PERMISSIONS_MODAL} from '#permissions/constants';
import {handleOpenSettings} from '#permissions/utils/permissionsHepler.ts';
import {GlobalModalProps} from '#types/global.ts';

export type requestType = 'location' | 'useEscapeLocation' | 'phone' | 'library' | 'camera';
export interface ModalProps {
  setGlobalModalState: SetterOrUpdater<GlobalModalProps>;
}
interface CheckPermissionWithModalProps extends ModalProps {
  requestType: requestType;
  modalTitle?: string;
  modalMessage?: string;
  onPressConfirm?: () => void;
}

export const checkPermissionWithModal = async ({
  requestType,
  modalTitle,
  modalMessage,
  onPressConfirm,
  setGlobalModalState,
}: CheckPermissionWithModalProps) => {
  const data = PERMISSIONS_MODAL[requestType];
  const grantedResult = await data.request();

  if (!grantedResult) {
    setGlobalModalState({
      isVisible: true,
      title: modalTitle ?? '권한 설정 안내',
      message: modalMessage ?? data.message,
      isConfirm: true,
      onPressConfirm: onPressConfirm ?? (() => handleOpenSettings()),
    });
  }
  return grantedResult;
};

export const checkBluetoothWithModal = async ({setGlobalModalState}: ModalProps) => {
  const useBluetooth = await bluetoothEnabled();
  const enabled = useBluetooth?.isFeatureEnabled;
  if (!enabled) {
    setGlobalModalState({
      isVisible: true,
      title: '안내',
      message: useBluetooth?.message ?? '블루투스를 확인해주세요.',
    });
  }
  return enabled;
};
