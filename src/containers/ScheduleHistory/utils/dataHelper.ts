import moment from 'moment/moment';

import {EventProps} from '#types/schedule.ts';

export const eventStatus = (eventList: Array<EventProps>) => {
  const entered = eventList.filter(val => {
    // 입실 내역
    return val.eventType === 'ENTER';
  })?.[0];
  const completed = eventList.filter(val => {
    // 퇴실 내역
    return val.eventType === 'COMPLETE';
  })?.[0];

  // 상태 (출석 인정시간 내 출석 + 퇴실 = P 아니면 N/P)
  const statusType = entered?.status === 'NORMAL' && completed ? 'P' : 'N/P';
  const statusColor = statusType === 'P' ? 'black' : 'red';

  const enteredTime = // 입실 시간
    entered ? `${moment(entered?.eventTime).format('HH : mm')}` : '-';
  const completedTime = // 퇴실 시간
    completed ? `${moment(completed?.eventTime).format('HH : mm')}` : '-';

  return {statusType, statusColor, enteredTime, completedTime};
};
