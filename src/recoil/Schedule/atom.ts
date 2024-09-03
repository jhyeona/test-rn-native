import {atom} from 'recoil';

import {ScheduleHistoryDataProps} from '#types/schedule.ts';

export const nowScheduleHistoryState = atom<ScheduleHistoryDataProps | null>({
  key: 'nowScheduleHistoryState',
  default: null,
});
