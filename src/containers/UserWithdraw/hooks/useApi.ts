import {useMutation} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {ACCESS_TOKEN, REFRESH_TOKEN} from '#constants/common.ts';
import {requestDeleteUser} from '#containers/UserWithdraw/services';
import GlobalState from '#recoil/Global';
import {ReqDeleteUser} from '#types/user.ts';
import {storage} from '#utils/storageHelper.ts';

export const useDeleteUser = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);
  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);

  const {mutateAsync: deleteUser} = useMutation({
    mutationFn: (payload: ReqDeleteUser) => {
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
        message: '탈퇴 처리 되었습니다.',
      });
      storage.delete(ACCESS_TOKEN);
      storage.delete(REFRESH_TOKEN);
      storage.clearAll();
      setIsLogin(false);
    },
  });

  return {deleteUser};
};
