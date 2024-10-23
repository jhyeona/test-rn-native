import {eventErrorMessage} from '#constants/responseMessage.ts';

export const showErrorModal = (
  errorCode: string,
  setModalState: (state: any) => void,
) => {
  const defaultMessage =
    '문제가 발생하였습니다.\n지속적으로 문제 발생시 기관에 문의해주세요.';

  const message = eventErrorMessage[errorCode] || defaultMessage;

  setModalState({
    isVisible: true,
    title: '안내',
    message,
  });
};
