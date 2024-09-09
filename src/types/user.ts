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
}

export type GenderType = 'M' | 'F';
export interface ReqSignUpTAS {
  phone: string;
  name: string;
  birth: string;
  gender: GenderType;
  telecom: string;
}

export interface ReqSignUp {
  phone: string;
  name: string;
  birth: string;
  password: string;
  gender: GenderType;
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
  isDelete: boolean;
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
