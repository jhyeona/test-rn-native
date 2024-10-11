import moment from 'moment';

import {ScheduleDefaultProps} from '#types/schedule.ts';

// 주간 데이터 중 빠른 시간, 늦은 시간 찾기
export const getAdjustedTimes = (scheduleList: ScheduleDefaultProps[]) => {
  let earliestTime: string | null = null;
  let latestTime: string | null = null;

  scheduleList.forEach(schedule => {
    const startTime = moment(schedule.scheduleStartTime).format('HH:mm');
    const endTime = moment(schedule.scheduleEndTime).format('HH:mm');

    if (
      !earliestTime ||
      moment(startTime, 'HH:mm').isBefore(moment(earliestTime, 'HH:mm'))
    ) {
      earliestTime = startTime;
    }

    if (
      !latestTime ||
      moment(endTime, 'HH:mm').isAfter(moment(latestTime, 'HH:mm'))
    ) {
      latestTime = endTime;
    }
  });

  if (earliestTime && latestTime) {
    // 01:00 미만이면 무조건 00:00으로 설정
    const adjustedEarliest = moment(earliestTime, 'HH:mm').isBefore(
      moment('01:00', 'HH:mm'),
    )
      ? '00:00'
      : moment(earliestTime, 'HH:mm').subtract(1, 'hours').format('HH:mm');

    // 23:00 이후이면 무조건 24:00으로 설정
    const adjustedLatest = moment(latestTime, 'HH:mm').isAfter(
      moment('23:00', 'HH:mm'),
    )
      ? '24:00'
      : moment(latestTime, 'HH:mm').add(1, 'hours').format('HH:mm');

    return {adjustedEarliest, adjustedLatest};
  }

  return {adjustedEarliest: null, adjustedLatest: null};
};
// 시간 차이를 분 단위로 계산하는 함수
export const getTimeDifferenceInMinutes = (
  startTime: string,
  endTime: string,
) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  return (endHour - startHour) * 60 + (endMinute - startMinute);
};

// 두 시간의 차이를 5분 간격으로 변환
export const getRowSpan = (startTime: string, endTime: string) => {
  const diffInMinutes = getTimeDifferenceInMinutes(startTime, endTime);
  return Math.ceil(diffInMinutes / 5); // 5분 단위로 계산하여 rowSpan 반환
};

// 5분 간격으로 24시간 생성 (24*60/5)
export const generateHours = (start: string, end: string) => {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const totalStartMinutes = startHour * 60 + startMinute;
  const totalEndMinutes = endHour * 60 + endMinute;

  const generatedHours = [];
  for (let i = totalStartMinutes; i <= totalEndMinutes; i += 5) {
    const hour = Math.floor(i / 60);
    const minute = i % 60;
    generatedHours.push(
      `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    );
  }
  return generatedHours;
};
