export interface GetAccessTokenProps {
  role: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface ResRefreshToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  role: string;
  token_type: string;
}

export interface ReqPhone {
  phone: string;
}

export interface UserDefaultProps extends ReqPhone {
  name: string;
  birth: string;
}

export interface ReqPasswordType {
  password: string;
}

export interface ResSmsConfirmProps extends ReqPhone {
  smsConfirmedId: string;
  ttl: number;
}

export interface ReqSmsConfirm extends ReqPhone {
  code: string;
}

export interface ReqSignIn extends ReqPhone {
  password: string;
  deviceInfo?: string;
  isRevive?: boolean;
}

export type GenderType = 'M' | 'F';
export interface ReqSignUpTAS extends UserDefaultProps {
  gender: GenderType;
  telecom: string;
}

export interface ResSignUpTAS {
  code: string;
  isVerified: boolean;
}

export interface ReqSignUp extends ReqPasswordType {
  code: string;
}

export interface StudentInfoProps {
  attendeeId: string;
  typeAttendee: string;
  academy: AcademyProps;
}

export interface UserInfoProps {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  dateVerifyPhone?: string;
  dateVerifyEmail?: string;
  studentList: Array<StudentInfoProps>;
  teacherList: Array<StudentInfoProps>;
  settingPushApp: boolean;
  dateDelete: string | null;
  isDelete: boolean;
}

export interface AcademyProps {
  academyId: string;
  name: string;
  picture?: string | null;
  useEscapeCheck: boolean;
  uuids: string[];
}

export interface InvitedAcademyListProps {
  invitedList: Array<{
    id: string;
    type: string;
    time: string;
    academy: AcademyProps;
  }>;
}

export interface ReqJoinAcademyProps {
  inviteIdList: Array<string>;
}

export interface ResJoinAcademyProps {
  attendeeList: Array<{
    attendeeId: string;
    typeAttendee: string;
    academy: AcademyProps;
  }>;
}

export interface ReqUpdatePush {
  settingPushApp: boolean;
}

export interface ReqAppVersions {
  APP_VERSION_ANDROID: string;
  APP_VERSION_IOS: string;
}
