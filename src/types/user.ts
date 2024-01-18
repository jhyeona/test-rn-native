export interface StudentInfoProps {
  attendeeId: number;
  // typeAttendee: string;
  academy: {
    academyId: number;
    name: string;
    picture?: string;
  };
}

export interface UserInfoProps {
  userId: number;
  name: string;
  phone: string;
  email: string;
  dateVerifyPhone: string;
  dateVerifyEmail: string;
  studentList: Array<StudentInfoProps>;
  teacherList: Array<{}>;
  settingPushApp: boolean;
}
