export interface GetScheduleProps {
  academyId?: number;
  date: string;
}

export interface GetScheduleHistoryProps {
  attendeeId: string;
  scheduleId: string;
}

export interface DayScheduleProps {
  scheduleList: Array<{
    scheduleId: number;
    scheduleParentId: number | null;
    scheduleStartTime: string;
    scheduleMinutes: number;
    lecture: {
      lectureId: number;
      lectureName: string;
      lectureAllowMinus: number;
      lectureAllowPlus: number;
      lectureAllowLatePlus: number;
      lectureCheckInterval: number;
    };
  }>;
}

export interface WeekScheduleProps {
  scheduleBunchList: Array<{
    lectureId: number;
    lectureName: string;
    scheduleStartTime: string;
    scheduleMinutes: number;
  }>;
}

export interface EventDetailProps {
  scheduleList: Array<{
    scheduleId: number;
    scheduleParentId: number | null;
    scheduleStartTime: string;
    scheduleMinutes: number;
    lecture: {
      lectureId: number;
      lectureName: string;
      lectureAllowMinus: number;
      lectureAllowPlus: number;
      lectureAllowLatePlus: number;
      lectureCheckInterval: number;
    };
    attendeeId: number;
    eventList: Array<{
      eventId: number;
      eventType: string;
      eventTime: string;
      status: string;
    }>;
  }>;
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
