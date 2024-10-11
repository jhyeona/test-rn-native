import moment, {Moment} from 'moment/moment';

/**
 * 주어진 날짜를 기준으로 해당 주의 주차
 * @param date - 기준 날짜
 * @return 날짜가 해당 월의 몇 주 차인지
 */
export const weekOfMonth = (date: Moment) => {
  const weekOfMonthNumber = (date: Moment) =>
    date.week() - moment(date).startOf('month').week() + 1;

  return `${date.format('YYYY년 MM월')} ${weekOfMonthNumber(date)}주차`;
};

/**
 * 시작 일시와 종료일시의 사이인지 여부
 */
export const isBetween = (startTime: Moment, endTime: Moment) => {
  return moment().isBetween(startTime, endTime, undefined, '[]');
};

/**
 * 주어진 날짜를 기준으로 해당 주의 월요일 날짜
 * @param date - 기준 날짜
 * @returns 해당 주의 월요일 날짜
 */
export const getMondayOfWeek = (date: Moment): Moment => {
  return date.clone().startOf('isoWeek'); // ISO 주의 시작은 월요일
};

/**
 * 주어진 날짜를 기준으로 해당 주의 모든 날짜 (월요일부터 일요일까지)
 * @param date - 기준 날짜
 * @returns 해당 주의 날짜 배열
 */
export const getDatesOfWeek = (date: Moment): Moment[] => {
  const monday = getMondayOfWeek(date);
  return Array.from({length: 7}, (_, index) =>
    monday.clone().add(index, 'days'),
  );
};

// 1. EXPIRED_ACADEMY("4035", "사용 계약 일자가 만료된 기관입니다! 해당 기관에 문의해주세요.", HttpStatus.FORBIDDEN),
// 2. LESS_INFO_FOR_EVENT("4016", "출석에 필요한 정보가 부족합니다!", HttpStatus.BAD_REQUEST),
// 3. NO_MATCH_DEVICE_ATTENDEE("4034", "기존에 출석한 기기와 다른 기기입니다! 출석하려면 해당 기관에 문의해주세요.", HttpStatus.FORBIDDEN),
// 4. INVALID_PLACE("4061", "강의에 입력된 위치 인증 장치 정보에 부합하지 않음.", HttpStatus.NOT_ACCEPTABLE),
// 5. NOT_ALLOWED_TIME("1005", "해당 스케줄의 이벤트 허용시간이 아닙니다!", HttpStatus.BAD_REQUEST),
// 6. INVALID_EVENT_SEQUENCE("1004", "유효하지 않은 순서로 이벤트를 요청했습니다.", HttpStatus.BAD_REQUEST),
export const handleErrorResponse = (code: string) => {
  switch (code) {
    case '1004':
      return '출석 순서가 유효하지 않습니다.';
    case '1005':
      return '출석 인정 시간이 아닙니다.';
    case '1006':
      return '해당 강의는 주기적으로 확인하는 강의가 아닙니다.';
    case '4061':
      return '위치 정보가 올바르지 않습니다.';
    case '4035':
      return '종료된 기관입니다. 해당 기관에 문의해주세요.';
    case '4016':
      return '기기 변경 시 기관에 문의해주세요.';
    case '4034':
      return '기기 변경 시 기관에 문의해주세요.';
    default:
      return '문제가 발생하였습니다. 지속적으로 문제 발생시 기관에 문의해주세요.';
  }
};
