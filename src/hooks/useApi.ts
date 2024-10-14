import {useEffect} from 'react';

import {useSetRecoilState} from 'recoil';

import GlobalState from '#recoil/Global';

export const useHandleError = (isError: boolean, error?: Error | null) => {
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  useEffect(() => {
    if (isError) {
      setModalState({
        isVisible: true,
        title: '오류',
        message: error?.message ?? '오류가 발생했습니다.',
      });
    }
  }, [isError, error, setModalState]);
};
