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

export interface ScheduleTimeProps {
  timeStart: string;
  timeEnd: string;
  check: boolean;
  eventType?: string;
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

export interface ScheduleDefaultProps {
  scheduleId: number;
  scheduleStartTime: string;
  scheduleEndTime: string;
  scheduleTimeList: Array<ScheduleTimeProps>;
  lecture: LectureProps;
}

export interface EventProps {
  eventId: number;
  eventType: 'ENTER' | 'LEAVE' | 'COMEBACK' | 'ATTEND' | 'COMPLETE';
  eventTime: string;
  status: 'NORMAL' | 'LATE' | 'EARLY';
}

export interface ScheduleDataProps {
  scheduleList: Array<ScheduleDefaultProps>;
}

export interface ScheduleHistoryDataProps extends ScheduleDefaultProps {
  attendeeId: number;
  eventList: Array<EventProps>;
  enterEvent: EventProps;
  completeEvent: EventProps | null;
  isLeaved: boolean;
  intervalEventList: Array<EventProps> | null;
}

export interface SchedulePeriodDataProps {
  academyId: number;
  historyList: Array<{
    schedule: ScheduleDefaultProps;
    eventList: Array<EventProps>;
  }>;
}

export interface ScheduleHistoryWeekDataProps
  extends Pick<
    ScheduleDefaultProps,
    Exclude<keyof ScheduleDefaultProps, 'eventList'>
  > {
  academyId: number;
  historyList: Array<ScheduleDefaultProps & {eventList: Array<EventProps>}>;
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
