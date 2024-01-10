import {atom} from 'recoil';
import {testProps} from '../../types/test.ts';

export const testTestState = atom<testProps>({
  key: 'testState',
  default: {
    text: 'RECOIL :D',
  },
});
