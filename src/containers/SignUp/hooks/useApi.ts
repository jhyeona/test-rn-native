import {useMutation} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {
  requestPostSignUp,
  requestPostSignUpPhone,
  requestPostSignUpSMSCode,
  requestPostSignUpSMSConfirm,
  requestPostSignUpTAS,
} from '#containers/SignUp/services';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {ReqSignUpTAS, ReqPhone, ReqSmsConfirm, ReqSignUp} from '#types/user.ts';

export const useReqSignUpPhone = () => {
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: signUpCheckPhone} = useMutation({
    mutationFn: (phone: string) => {
      return requestPostSignUpPhone(phone);
    },
    onError: (error: CommonResponseProps<null>) => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: error.message ?? '휴대폰번호 확인에 실패하였습니다.',
      });
    },
  });

  return {signUpCheckPhone};
};

export const useReqSignUpTAS = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);
  const setToast = useSetRecoilState(GlobalState.globalToastState);

  const {mutateAsync: signUpTAS} = useMutation({
    mutationFn: (payload: ReqSignUpTAS) => {
      return requestPostSignUpTAS(payload);
    },
    onMutate: () => {
      setIsLoading(true);

      // TAS 인증 시간 지연 (약 4~7초 딜레이 되는 것으로 파악)으로 인해 안내 문구 출력
      setToast({
        isVisible: true,
        time: 4000,
        message:
          '인증 요청되었습니다. \n환경에 따라 다소 시간이 지연될 수 있습니다.',
      });
    },
    onSettled: () => {
      setIsLoading(false);
      setModalState({
        isVisible: true,
        title: '안내',
        message: '인증 요청이 완료되었습니다.',
      });
    },
    onError: (error: CommonResponseProps<null>) => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: error.message ?? '휴대폰 인증에 실패했습니다.',
      });
    },
  });

  return {signUpTAS};
};

export const useReqSMSCode = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: signUpReqSmsCode} = useMutation({
    mutationFn: (payload: ReqPhone) => {
      return requestPostSignUpSMSCode(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '인증 문자가 발송되었습니다.',
      });
    },
    onError: (error: CommonResponseProps<null>) => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: error.message ?? '인증문자 발송에 실패했습니다.',
      });
    },
  });
  return {signUpReqSmsCode};
};

export const useReqSMSConfirm = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: smsConfirm} = useMutation({
    mutationFn: (payload: ReqSmsConfirm) => {
      return requestPostSignUpSMSConfirm(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onError: (error: CommonResponseProps<null>) => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: error.message ?? '인증에 실패하였습니다.',
      });
    },
  });

  return {smsConfirm};
};

export const useReqSignUp = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: signUp} = useMutation({
    mutationFn: (payload: ReqSignUp) => {
      return requestPostSignUp(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: `회원가입이 완료되었습니다. \n로그인해 주세요.`,
      });
    },
    onError: (error: CommonResponseProps<null>) => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: error.message ?? '회원가입에 실패했습니다.',
      });
    },
  });

  return {signUp};
};
