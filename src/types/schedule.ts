export type EventType = 'ENTER' | 'LEAVE' | 'COMEBACK' | 'ATTEND' | 'COMPLETE';

export interface GetScheduleProps {
  academyId?: string;
  date: string;
}

export interface GetScheduleHistoryProps {
  scheduleId: string;
}

export interface ScheduleTimeProps {
  timeStart: string;
  timeEnd: string;
  check: boolean;
  eventType?: string;
}

export interface LectureProps {
  sequence?: number;
  lectureId: string;
  lectureName: string;
  lecturePlaceName: string;
  lectureStartDate: string;
  lectureEndDate: string;
  lectureAllowMinus: number;
  lectureAllowPlus: number;
  lectureAllowEndMinus: number;
  lectureAllowEndPlus: number;
  // 인정 시간 이후에도 퇴실 버튼 클릭이 가능한지 여부
  lectureIsAllowedAfterEnd: boolean;
  lectureUseEscapeCheck: boolean;
}

export interface ScheduleDefaultProps {
  sequence: number;
  scheduleId: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  scheduleTimeList: Array<ScheduleTimeProps>;
  lecture: LectureProps;
}

export interface EventProps {
  eventId?: string;
  eventType?: EventType;
  eventTime: string;
  baseTime: string;
  status: 'NORMAL' | 'LATE' | 'EARLY';
}

export interface ScheduleDataProps {
  scheduleList: Array<ScheduleDefaultProps>;
}

export interface ScheduleHistoryDataProps extends ScheduleDefaultProps {
  attendeeId: string;
  eventList: Array<EventProps>;
  enterEvent: EventProps;
  completeEvent: EventProps | null;
  isAllowedEnter: boolean; // 현재 입실 가능한 시간인지에 대한 여부
  isLeaved: boolean;
  isAllowedComplete: boolean; // 현재 퇴실 가능한 상황인지에 대한 여부 (전제 조건: isAllowedEnter === true + 퇴실 인정 시간 이내)
  intervalEventList: Array<EventProps> | null;
}

// 내 출석 기록 요청
export interface ReqGetScheduleHistory {
  academyId: string;
  startDate: string;
  endDate: string;
}

// 내 출석 기록 응답
export interface ResSchedulePeriodDataProps {
  academyId: string;
  historyList: Array<{
    schedule: ScheduleDefaultProps;
    eventList: Array<EventProps>;
  }>;
}

export interface PostEventProps {
  scheduleId: string;
  deviceInfo?: string;
  os?: string;
  appVersion?: string;
  locationPermit?: boolean;
  latitude: number;
  longitude: number;
  altitude: number;
  wifis: Array<{
    ssid: string;
    bssid: string;
    rssi: number;
  }>;
  bles: Array<{
    uuid: string;
    major: string;
    minor: string;
    rssi: number;
  }>;
}
