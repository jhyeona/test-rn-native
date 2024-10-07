import {useMutation} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {ACCESS_TOKEN, REFRESH_TOKEN} from '#constants/common.ts';
import {requestPostGetToken} from '#containers/SignIn/services';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {ReqSignIn} from '#types/user.ts';
import {setItem, storage} from '#utils/storageHelper.ts';

export const useSignIn = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: signIn} = useMutation({
    mutationFn: (requestData: ReqSignIn) => {
      return requestPostGetToken({...requestData});
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: data => {
      setIsLogin(true);
      setItem(ACCESS_TOKEN, data.access_token);
      setItem(REFRESH_TOKEN, data.refresh_token);
    },
    onError: (error: CommonResponseProps<null>) => {
      setIsLogin(false);
      setModalState({
        isVisible: true,
        title: '안내',
        message: error.message ?? '로그인에 실패하였습니다.',
      });
    },
  });

  return {signIn};
};
