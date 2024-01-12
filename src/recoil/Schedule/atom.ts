import {atom} from 'recoil';
import {testProps} from '../../types/common.ts';

export const testTestState = atom<testProps>({
  key: 'testState',
  default: {
    text: 'RECOIL :D',
  },
});
