export interface GetScheduleProps {
  academyId?: number;
  date: string;
}

export interface GetScheduleHistoryProps {
  attendeeId: number;
  scheduleId?: number;
}

export interface GetScheduleHistoryWeekProps {
  academyId: number;
  startDate: string;
  endDate: string;
}

export interface LectureProps {
  lectureId: number;
  lectureName: string;
  lecturePlaceName: string;
  lectureStartDate: string;
  lectureEndDate: string;
  lectureAllowMinus: number;
  lectureAllowPlus: number;
  lectureAllowEndMinus: number;
  lectureAllowEndPlus: number;
}

export interface EventProps {
  eventId: number;
  eventType: string;
  eventTime: string;
  status: string;
}

export interface ScheduleDataProps {
  scheduleList: Array<{
    scheduleId: number;
    scheduleStartTime: string;
    scheduleEndTime: string;
    scheduleIntervalTimeList: Array<string>;
    lecture: LectureProps;
  }>;
}

export interface ScheduleHistoryDataProps extends ScheduleDataProps {
  attendeeId: number;
  eventList: Array<EventProps>;
  enterEvent: EventProps;
  completeEvent: EventProps | null;
  isLeaved: boolean;
  intervalEventList: Array<EventProps> | null;
}

export interface ScheduleHistoryWeekDataProps {
  academyId: number;
  historyList: Array<{
    scheduleId: number;
    scheduleStartTime: string;
    scheduleEndTime: string;
    scheduleIntervalTimeList: Array<string>;
    lecture: LectureProps;
    eventList: Array<EventProps>;
  }>;
}

export interface PostEventProps {
  attendeeId: number;
  scheduleId: number;
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
    major: number;
    minor: number;
  }>;
}
