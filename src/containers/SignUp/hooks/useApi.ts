import {useMutation} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {
  requestPostSignUp,
  requestPostSignUpPhone,
  requestPostSignUpSMSConfirm,
  requestPostSignUpTAS,
} from '#containers/SignUp/services';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {ReqSignUpTAS, ReqSmsConfirm, ReqSignUp} from '#types/user.ts';

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

export const useReqSignUpTAS = (isChangePhone?: boolean) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: signUpTAS} = useMutation({
    mutationFn: (payload: ReqSignUpTAS) => {
      return requestPostSignUpTAS(payload, isChangePhone);
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
        message: error.message ?? '휴대폰 인증에 실패했습니다.',
      });
    },
  });

  return {signUpTAS};
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
        message: error.message ?? '인증에 실패하였습니다. 다시 시도해주세요.',
      });
    },
    retry: (failureCount, error) => {
      console.log('retry', failureCount, '/ error code', error.code);
      return error.code === '0001' && failureCount < 4; // retry count 는 0부터 시작, 총 5회 시도
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
        message: `회원가입이 완료되었습니다. 로그인해 주세요.`,
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
