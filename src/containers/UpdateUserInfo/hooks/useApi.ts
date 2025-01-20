import {useMutation} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {requestPatchUpdatePersonal} from '#containers/UpdateUserInfo/services';
import {useInvalidateQueriesAndShowModal} from '#hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';

export const useReqUpdatePersonal = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);
  const invalidateQueriesAndShowModal = useInvalidateQueriesAndShowModal();

  const {mutateAsync: updatePersonal} = useMutation({
    mutationFn: (payload: {code: string}) => {
      return requestPatchUpdatePersonal(payload);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: async () => {
      await invalidateQueriesAndShowModal(['userInfo'], '회원정보가 성공적으로 변경되었습니다.');
    },
    onError: (error: CommonResponseProps<null>) => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: error.message ?? '',
      });
    },
  });

  return {updatePersonal};
};
