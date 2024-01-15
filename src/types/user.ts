export interface UserInfoProps {
  userId: number;
  name: string;
  phone: string;
  email: string;
  dateVerifyPhone: string;
  dateVerifyEmail: string;
  studentList: Array<{
    attendeeId: string;
    typeAttendee: string;
    academy: Array<{
      academyId: number;
      name: string;
      picture: string;
    }>;
  }>;
  teacherList: Array<{}>;
  settingPushApp: boolean;
}
