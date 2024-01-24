export interface GetScheduleProps {
  academyId?: number;
  date: string;
}

export interface GetScheduleHistoryProps {
  attendeeId: number;
  scheduleId?: number;
}
export interface LectureProps {
  lectureId: number;
  lectureName: string;
  lecturePlaceName: string;
  lectureStartDate: string;
  lectureEndDate: string;
  lectureAllowMinus: number;
  lectureAllowPlus: number;
  lectureAllowLatePlus: number;
  lectureCheckInterval: number;
}

export interface DayScheduleDetailProps {
  scheduleId: number;
  scheduleParentId: number | null;
  scheduleStartTime: string;
  scheduleMinutes: number;
  lecture: LectureProps;
}
export interface DayScheduleProps {
  scheduleList: Array<DayScheduleDetailProps>;
}

export interface WeekScheduleProps {
  scheduleBunchList: Array<{
    lecture: LectureProps;
    scheduleBunchStartTime: string;
    scheduleBunchMinutes: number;
  }>;
}

export interface ScheduleProps {
  scheduleId: number;
  scheduleParentId: number | null;
  scheduleStartTime: string;
  scheduleMinutes: number;
  lecture: LectureProps;
  attendeeId: number;
  eventList: Array<{
    eventId: number;
    eventType: string;
    eventTime: string;
    status: string;
  }>;
}

export interface EventDetailProps {
  scheduleList: Array<ScheduleProps>;
}

export interface EventProps {
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
    id: string;
    major: number;
    minor: number;
  }>;
}
