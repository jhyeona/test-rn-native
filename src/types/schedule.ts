export interface DayScheduleProps {
  scheduleList: Array<{
    scheduleId: number;
    scheduleParentId: number | null;
    lectureId: number;
    lectureName: string;
    scheduleStartTime: string;
    scheduleMinutes: number;
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
