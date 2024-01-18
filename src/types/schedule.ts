export interface GetScheduleProps {
  academyId?: number;
  date: string;
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
