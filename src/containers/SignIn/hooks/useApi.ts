import {useState} from 'react';

import {useMutation} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {ACCESS_TOKEN, REFRESH_TOKEN} from '#constants/common.ts';
import {loginErrorMessage} from '#constants/responseMessage.ts';
import {requestPostGetToken} from '#containers/SignIn/services';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {ReqSignIn} from '#types/user.ts';
import {setStorageItem} from '#utils/storageHelper.ts';

export const useSignIn = () => {
  const [requestData, setRequestData] = useState<ReqSignIn | null>(null);

  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: signIn} = useMutation({
    mutationFn: (payload: ReqSignIn) => {
      return requestPostGetToken(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: data => {
      setIsLogin(true);
      setStorageItem(ACCESS_TOKEN, data.access_token);
      setStorageItem(REFRESH_TOKEN, data.refresh_token);
    },
    onError: (error: CommonResponseProps<null>) => {
      setIsLogin(false);

      let message = error?.message ?? '로그인에 실패하였습니다.';
      if (error.code in loginErrorMessage) {
        message = loginErrorMessage[error.code];
      }

      // 탈퇴 대기중에 로그인 요청했을 경우 탈퇴 철회 가능하도록 처리
      if (error.code === '4018') {
        console.log(error);
        setModalState({
          isVisible: true,
          isConfirm: true,
          title: '안내',
          message: error.description ?? message,
          onPressConfirm: async () => {
            if (requestData) {
              await signIn({...requestData, isRevive: true});
            }
          },
        });
        return;
      }
      setModalState({
        isVisible: true,
        title: '안내',
        message,
      });
    },
  });

  const initiateSignIn = async (data: ReqSignIn) => {
    setRequestData(data); // requestData 업데이트
    await signIn(data); // 로그인 시도
  };

  return {signIn: initiateSignIn};
};
