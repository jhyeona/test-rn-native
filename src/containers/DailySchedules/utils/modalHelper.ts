import {eventErrorMessage} from '#constants/responseMessage.ts';
import {sentryCaptureException} from '#services/sentry.ts';
import {bluetoothFeatureEnabled} from '#utils/stickySdkHelper.ts';

export const showErrorModal = (errorCode: string, setModalState: (state: any) => void) => {
  const defaultMessage = '문제가 발생하였습니다. 지속적으로 문제 발생시 기관에 문의해주세요.';

  const message = eventErrorMessage[errorCode] || defaultMessage;

  setModalState({
    isVisible: true,
    title: '안내',
    message,
  });
};

export const bluetoothEnabled = async () => {
  try {
    const bluetooth = await bluetoothFeatureEnabled();
    const {isFeature, isEnabled} = bluetooth;
    let message = '';
    if (!isFeature || !isEnabled) {
      message = !isFeature
        ? '블루투스(BLE)를 지원하지 않는 기기는\n출석이 불가합니다.'
        : '블루투스 기능이 꺼져있습니다. 블루투스 기능을 활성화 해주세요.';
    }
    return {message, isFeatureEnabled: isFeature && isEnabled};
  } catch (error) {
    sentryCaptureException({error, eventName: 'bluetoothCheckWithModal'});
    return {message: '', isFeatureEnabled: false};
  }
};
