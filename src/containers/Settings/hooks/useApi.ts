import {useMutation} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {requestPatchUpdatePush} from '#containers/Settings/services';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {ReqUpdatePush} from '#types/user.ts';

export const useUpdatePush = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: updatePush} = useMutation({
    mutationFn: (payload: ReqUpdatePush) => {
      return requestPatchUpdatePush(payload);
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

  return {updatePush};
};
