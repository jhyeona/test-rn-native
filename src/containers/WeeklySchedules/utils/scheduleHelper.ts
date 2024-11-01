import moment from 'moment';

import {ScheduleDefaultProps} from '#types/schedule.ts';

// 주간 데이터 중 빠른 시간, 늦은 시간 찾기
export const getAdjustedTimes = (scheduleList: ScheduleDefaultProps[]) => {
  let earliestTime: string | null = null;
  let latestTime: string | null = null;

  scheduleList.forEach(schedule => {
    const startTime = moment(schedule.scheduleStartTime).format('HH:mm');
    const endTime = moment(schedule.scheduleEndTime).format('HH:mm');

    if (!earliestTime || moment(startTime, 'HH:mm').isBefore(moment(earliestTime, 'HH:mm'))) {
      earliestTime = startTime;
    }

    if (!latestTime || moment(endTime, 'HH:mm').isAfter(moment(latestTime, 'HH:mm'))) {
      latestTime = endTime;
    }
  });

  if (earliestTime && latestTime) {
    // 01:00 미만이면 무조건 00:00으로 설정
    const adjustedEarliest = moment(earliestTime, 'HH:mm').isBefore(moment('01:00', 'HH:mm'))
      ? '00:00'
      : moment(earliestTime, 'HH:mm').subtract(1, 'hours').format('HH:mm');

    // 23:00 이후이면 무조건 24:00으로 설정
    const adjustedLatest = moment(latestTime, 'HH:mm').isAfter(moment('23:00', 'HH:mm'))
      ? '24:00'
      : moment(latestTime, 'HH:mm').add(1, 'hours').format('HH:mm');

    return {adjustedEarliest, adjustedLatest};
  }

  return {adjustedEarliest: null, adjustedLatest: null};
};
// 시간 차이를 분 단위로 계산하는 함수
export const getTimeDifferenceInMinutes = (startTime: string, endTime: string) => {
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
  if (end !== '00:00') {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = endHour * 60 + endMinute;

    const generatedHours = [];
    for (let i = totalStartMinutes; i <= totalEndMinutes; i += 5) {
      const hour = Math.floor(i / 60);
      const minute = i % 60;
      generatedHours.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
    return generatedHours;
  }
  return [];
};

// 오늘 버튼 클릭시 선택돼 있는 날짜가 이번주 중 하루인지
export const isDateInSameWeek = (selectedDate: Date, referenceDate: Date): boolean => {
  const normalizeDate = (date: Date): Date =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // referenceDate 의 요일을 구하고, 월요일과 일요일 계산
  const dayOfWeek = referenceDate.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 월요일과의 차이 계산
  const mondayOfWeek = new Date(referenceDate);
  mondayOfWeek.setDate(referenceDate.getDate() - diffToMonday); // 주의 첫날(월요일)

  const sundayOfWeek = new Date(mondayOfWeek);
  sundayOfWeek.setDate(mondayOfWeek.getDate() + 6); // 주의 마지막 날(일요일)

  // selectedDate 가 해당 주의 월요일과 일요일 사이에 있는지 확인
  const normalizedSelectedDate = normalizeDate(selectedDate);
  return (
    normalizedSelectedDate >= normalizeDate(mondayOfWeek) &&
    normalizedSelectedDate <= normalizeDate(sundayOfWeek)
  );
};
