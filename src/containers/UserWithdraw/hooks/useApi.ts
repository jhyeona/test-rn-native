import {useMutation} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {requestDeleteUser} from '#containers/UserWithdraw/services';
import GlobalState from '#recoil/Global';
import {ReqPasswordType} from '#types/user.ts';
import {clearStorage} from '#utils/storageHelper.ts';

export const useDeleteUser = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);
  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);

  const {mutateAsync: deleteUser} = useMutation({
    mutationFn: (payload: ReqPasswordType) => {
      return requestDeleteUser(payload);
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
        message: '탈퇴 처리 요청 되었습니다.',
      });
      clearStorage();
      setIsLogin(false);
    },
  });

  return {deleteUser};
};
