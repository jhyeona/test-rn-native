import {useMutation} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import {reqFindPassword} from '#containers/FindPassword/services';
import GlobalState from '#recoil/Global';
import {CommonResponseProps} from '#types/common.ts';
import {UserDefaultProps} from '#types/user.ts';

export const useReqFindPassword = () => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const {mutateAsync: findPassword} = useMutation({
    mutationFn: (payload: UserDefaultProps) => {
      return reqFindPassword(payload);
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
        message:
          '임시 비밀번호를 전송하였습니다.\n임시 비밀번호로 로그인해주세요.',
      });
    },
    onError: (error: CommonResponseProps<null>) => {
      setModalState({
        isVisible: true,
        title: '안내',
        message: error.message ?? '임시 비밀번호 발송에 실패했습니다.',
      });
    },
  });

  return {findPassword};
};
