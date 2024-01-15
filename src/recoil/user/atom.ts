import {atom} from 'recoil';
import {UserInfoProps} from '../../types/user.ts';

export const userInfoState = atom<UserInfoProps | null>({
  key: 'userInfoState',
  default: null,
});
