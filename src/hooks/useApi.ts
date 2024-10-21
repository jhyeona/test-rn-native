import {useEffect} from 'react';

import {useQueryClient} from '@tanstack/react-query';
import {useSetRecoilState} from 'recoil';

import GlobalState from '#recoil/Global';

// API 성공 + queryKey 로 캐시 초기화
const useInvalidateQueriesAndShowModal = () => {
  const queryClient = useQueryClient();
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  return async (queryKey: string[], message?: string) => {
    if (queryKey) {
      await queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      setModalState({
        isVisible: true,
        title: '안내',
        message: message ?? '처리 되었습니다.',
      });
    }
  };
};

// API Error 기본 모달 출력
const useHandleError = (isError: boolean, error?: Error | null) => {
  const setModalState = useSetRecoilState(GlobalState.globalModalState);
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);

  useEffect(() => {
    if (isError) {
      setModalState({
        isVisible: true,
        title: '오류',
        message: error?.message ?? '오류가 발생했습니다.',
      });
    }
  }, [isError, error, setModalState, setIsLoading]);
};

// API 로딩 스피너 관리
const useLoadingEffect = (status: string, fetchStatus: string) => {
  const setIsLoading = useSetRecoilState(GlobalState.globalLoadingState);

  useEffect(() => {
    setIsLoading(status === 'pending' && fetchStatus === 'fetching');
  }, [status, fetchStatus, setIsLoading]);
};

export {useInvalidateQueriesAndShowModal, useHandleError, useLoadingEffect};
