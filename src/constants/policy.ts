import Config from 'react-native-config';

export const withdrawPolicyList = [
  '지금 탈퇴하면 출석중이거나 출석예정인 강의의 출석을 더이상 할 수 없게 돼요.',
  '회원 탈퇴 철회는 7일 이내에 가능하고, 7일 이후에는 탈퇴처리가 되어 다시 로그인을 할 수 없어요.',
  '탈퇴 처리가 된 이후에는 새로 회원가입을 진행해야해요.',
  '새로 회원가입을 한 계정에서는 이전의 출석 내역을 확인할 수 없어요.',
];

const s3Url = Config.S3_URL;
export const TermsOfServiceUrl = `https://${s3Url}.ap-northeast-2.amazonaws.com/static/TermsOfService.html`;
export const PersonalInformationUrl = `https://${s3Url}.ap-northeast-2.amazonaws.com/static/PersonalInformationAgreement.html`;
export const PrivacyPolicyUrl = `https://${s3Url}.ap-northeast-2.amazonaws.com/static/PrivacyPolicy.html`;
