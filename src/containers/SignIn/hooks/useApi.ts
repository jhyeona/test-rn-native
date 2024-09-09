import {useMutation} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {requestPostGetToken} from '#containers/SignIn/services';
import globalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {ReqSignIn} from '#types/user.ts';
import {storage} from '#utils/storageHelper.ts';

export const useSignIn = () => {
  const setIsLoading = useSetRecoilState(globalState.globalLoadingState);
  const setIsLogin = useSetRecoilState(globalState.isLoginState);
  const setModalState = useSetRecoilState(globalState.globalModalState);

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
      storage.set('access_token', data.access_token);
      storage.set('refresh_token', data.refresh_token);
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
