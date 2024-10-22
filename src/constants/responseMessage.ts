/** 에러 코드와 메시지 매핑 */
import {EventType} from '#types/schedule.ts';

// 로그인 에러 메세지
export const loginErrorMessage: Record<string, string> = {
  '4018': '회원 탈퇴 유예기간(7일)입니다.\n탈퇴를 철회하고 로그인할까요?',
  '4000': '휴대폰 번호와 비밀번호를 확인해주세요.',
  '4019':
    '사용 중지된 기관의 테스트 계정입니다.\n기관 재사용은 엘핀에 문의해주세요.',
};

// 이벤트 요청 성공 메세지
export const eventSuccessMessage: Record<EventType, string> = {
  ENTER: '입실 처리 되었습니다.',
  COMPLETE: '퇴실 처리 되었습니다.',
  LEAVE: '외출이 종료되었습니다.',
  COMEBACK: '외출 복귀 처리되었습니다.',
  ATTEND: '출석 처리 되었습니다.',
};

// 이벤트 요청 에러 메세지
// 1. EXPIRED_ACADEMY("4035", "사용 계약 일자가 만료된 기관입니다! 해당 기관에 문의해주세요.", HttpStatus.FORBIDDEN),
// 2. LESS_INFO_FOR_EVENT("4016", "출석에 필요한 정보가 부족합니다!", HttpStatus.BAD_REQUEST),
// 3. NO_MATCH_DEVICE_ATTENDEE("4034", "기존에 출석한 기기와 다른 기기입니다! 출석하려면 해당 기관에 문의해주세요.", HttpStatus.FORBIDDEN),
// 4. INVALID_PLACE("4061", "강의에 입력된 위치 인증 장치 정보에 부합하지 않음.", HttpStatus.NOT_ACCEPTABLE),
// 5. NOT_ALLOWED_TIME("1005", "해당 스케줄의 이벤트 허용시간이 아닙니다!", HttpStatus.BAD_REQUEST),
// 6. INVALID_EVENT_SEQUENCE("1004", "유효하지 않은 순서로 이벤트를 요청했습니다.", HttpStatus.BAD_REQUEST),
export const eventErrorMessage: Record<string, string> = {
  '1004': '출석 순서가 유효하지 않습니다.',
  '1005': '출석 인정 시간이 아닙니다.',
  '1006': '해당 강의는 주기적으로 확인하는 강의가 아닙니다.',
  '4016': '기기 변경 시 기관에 문의해주세요.',
  '4034': '기기 변경 시 기관에 문의해주세요.',
  '4035': '종료된 기관입니다. 해당 기관에 문의해주세요.',
  '4061': '위치 정보가 올바르지 않습니다.',
};
