/** 주간 캘린더의 날짜 데이터를 생성하는 함수 */
import moment, {Moment} from 'moment/moment';

import {ScheduleDefaultProps} from '#types/schedule.ts';
import {isBetween} from '#utils/scheduleHelper.ts';

export interface CalendarItem {
  date: Moment;
  key: string;
}

export const generateWeekDates = (
  start: Moment,
  numberOfDays: number,
): CalendarItem[] => {
  const dates: CalendarItem[] = [];
  for (let i = 0; i < numberOfDays; i++) {
    const date = start.clone().add(i, 'day');
    dates.push({date, key: date.format('YYYY-MM-DD')});
  }
  return dates;
};

// 강의 진행 여부
export const allowScheduleTime = ({
  scheduleData,
  startTime,
  endTime,
}: {
  scheduleData: ScheduleDefaultProps;
  startTime: string;
  endTime: string;
}) => {
  const allowStartMinusTime = moment(startTime).subtract(
    scheduleData?.lecture.lectureAllowMinus,
    'minutes',
  );
  const allowStartPlusTime = moment(startTime).add(
    scheduleData?.lecture.lectureAllowPlus,
    'minutes',
  );
  const allowEndPlusTime = moment(endTime).add(
    scheduleData?.lecture.lectureAllowEndPlus,
    'minutes',
  );

  return {
    // 출석 인정 시간의 시작
    allowStartMinusTime,
    // 퇴실 인정 시간의 시작
    allowEndPlusTime,
    // 출퇴 인정시간 포함한 강의 진행중인지 여부
    isAllowBetween: isBetween(allowStartMinusTime, allowEndPlusTime),
    // 출퇴 인정시간을 포함하지 않은 순수 강의 진행중인지 여부
    isTimeBetween: isBetween(moment(startTime), moment(endTime)),
    // 출석 인정시간 포함하여 강의시간 이전인지 여부
    isBefore: moment().isBefore(allowStartMinusTime),
    // 퇴실 인정시간 포함하여 강의시간 이후인지 여부
    isAfter: moment().isAfter(allowEndPlusTime),
    // (시간별 출결) 출석 인정시간만 포함한 강의 시간의 사이 여부
    isAttendBetween: isBetween(allowStartMinusTime, moment(endTime)),
    // (시간별 출결) 출석 버튼을 누를 수 있는 시간
    isAttendEnter: isBetween(allowStartMinusTime, allowStartPlusTime),
    // (시간별 출결) 출석 인정 시간 종료 이후
    isAttendAfter: moment().isAfter(allowStartPlusTime),
  };
};
