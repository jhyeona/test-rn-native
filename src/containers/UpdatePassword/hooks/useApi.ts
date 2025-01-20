import {useMutation} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {requestPatchUpdatePassword} from '#containers/UpdatePassword/services';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {ReqPasswordType} from '#types/user.ts';

export const useUpdatePassword = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: updatePassword} = useMutation({
    mutationFn: (payload: ReqPasswordType) => {
      return requestPatchUpdatePassword(payload);
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
        message: error.message ?? '',
      });
    },
  });

  return {updatePassword};
};
