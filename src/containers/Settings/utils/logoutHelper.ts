import {onesignalLogout} from '#utils/onesignalHelper';
import {clearStorage} from '#utils/storageHelper.ts';

export const handleLogout = ({
  setGlobalModalState,
  setIsLogin,
}: {
  setGlobalModalState: (value: any) => void;
  setIsLogin: (value: boolean) => void;
}) => {
  setGlobalModalState({
    isVisible: true,
    title: '안내',
    message: '로그아웃하시겠습니까?',
    isConfirm: true,
    onPressConfirm: () => {
      clearStorage();
      onesignalLogout();
      setIsLogin(false);
    },
  });
};
