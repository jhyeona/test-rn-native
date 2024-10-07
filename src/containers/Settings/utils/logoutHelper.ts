import {ACCESS_TOKEN, REFRESH_TOKEN} from '#constants/common.ts';
import {onesignalLogout} from '#utils/onesignalHelper';
import {storage} from '#utils/storageHelper.ts';

export const handleLogout = ({
  setGlobalModalState,
  setUserData,
  setIsLogin,
}: {
  setGlobalModalState: (value: any) => void;
  setUserData: (value: any) => void;
  setIsLogin: (value: boolean) => void;
}) => {
  setGlobalModalState({
    isVisible: true,
    title: '안내',
    message: '로그아웃하시겠습니까?',
    isConfirm: true,
    onPressConfirm: () => {
      storage.delete(ACCESS_TOKEN);
      storage.delete(REFRESH_TOKEN);
      storage.clearAll();
      onesignalLogout();
      setUserData(null);
      setIsLogin(false);
    },
  });
};
