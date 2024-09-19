export interface GetAccessTokenProps {
  role: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface ResSmsConfirmProps {
  smsConfirmedId: string;
  phone: string;
  ttl: number;
}

export interface ReqPhone {
  phone: string;
}

export interface ReqSmsConfirm extends ReqPhone {
  verifyCode: string;
}

export interface ReqSignIn {
  phone: string;
  password: string;
  deviceInfo?: string;
}

export interface UserDefaultProps {
  phone: string;
  name: string;
  birth: string;
}

export type GenderType = 'M' | 'F';
export interface ReqSignUpTAS extends UserDefaultProps {
  gender: GenderType;
  telecom: string;
}

export interface ReqSignUp extends UserDefaultProps {
  password: string;
  gender: GenderType;
}

export interface StudentInfoProps {
  attendeeId: string;
  typeAttendee: string;
  academy: {
    academyId: string;
    name: string;
    picture?: string;
  };
}

export interface UserInfoProps {
  userId: string;
  name: string;
  phone: string;
  email: string;
  dateVerifyEmail: string;
  studentList: Array<StudentInfoProps>;
  teacherList: Array<{}>;
  settingPushApp: boolean;
  dateDelete: string | null;
  isDelete: boolean;
}

export interface AcademyProps {
  academyId: string;
  name: string;
  picture?: string | null;
}

export interface InvitedAcademyListProps {
  invitedList: Array<{
    id: string;
    type: string;
    time: string;
    academy: AcademyProps;
  }>;
}

export interface JoinAcademyProps {
  attendeeList: Array<{
    attendeeId: string;
    typeAttendee: string;
    academy: AcademyProps;
  }>;
}
