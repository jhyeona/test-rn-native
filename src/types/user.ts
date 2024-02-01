export interface GetAccessTokenProps {
  role: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface SmsConfirmProps {
  smsConfirmedId: string;
  phone: string;
  ttl: number;
}

export interface StudentInfoProps {
  attendeeId: number;
  typeAttendee: string;
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
  dateVerifyEmail: string;
  studentList: Array<StudentInfoProps>;
  teacherList: Array<{}>;
  settingPushApp: boolean;
  dateDelete: string | null;
}

export interface AcademyProps {
  academyId: number;
  name: string;
  picture?: string | null;
}

export interface InvitedAcademyListProps {
  invitedList: Array<{
    id: number;
    type: string;
    time: string;
    academy: AcademyProps;
  }>;
}

export interface JoinAcademyProps {
  attendeeList: Array<{
    attendeeId: number;
    typeAttendee: string;
    academy: AcademyProps;
  }>;
}
