import React, {ReactNode, useEffect, useState} from 'react';
import {AppState, AppStateStatus, Pressable, StyleSheet, View} from 'react-native';
import Config from 'react-native-config';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {useSetRecoilState} from 'recoil';

import Checkbox from '#components/common/Checkbox/Checkbox.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CInput from '#components/common/CustomInput/CInput.tsx';
import {CustomScrollView} from '#components/common/CustomScrollComponents';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import DefaultModal from '#components/common/Modal/DefaultModal.tsx';
import ProgressBar from '#components/common/Progress/Progress.tsx';
import CWebView from '#components/common/WebView/CWebView.tsx';
import CInputWithDropdown from '#components/User/CInputWithDropdown.tsx';
import {REQ_DATE_FORMAT} from '#constants/common.ts';
import {PersonalInformationUrl, TermsOfServiceUrl} from '#constants/policy.ts';
import {GENDER_LIST, TELECOM_LIST} from '#constants/user.ts';
import SmsGuide from '#containers/SignUp/components/SmsGuide.tsx';
import {
  useReqSignUp,
  useReqSignUpPhone,
  useReqSignUpTAS,
  useReqSMSConfirm,
} from '#containers/SignUp/hooks/useApi.ts';
import {openSMS} from '#containers/SignUp/utils/linkingHelper.ts';
import {getInitialSignUpData} from '#containers/SignUp/utils/signupHelper.ts';
import GlobalState from '#recoil/Global';
import {errorToCrashlytics, setAttToCrashlytics} from '#services/firebase.ts';
import {GenderType} from '#types/user.ts';
import {areAllValuesTrue} from '#utils/objectHelper.ts';
import {checkDate, checkName, checkPassword, checkPhone} from '#utils/regExpHelper.ts';

export interface SignUpDataProps {
  name: string;
  birthday: string;
  gender: string;
  phone: string;
  telecom: string;
  smsCode: string;
  password: string;
  rePassword: string;
  code?: string;
}
interface ModalProps {
  isVisible: boolean;
  title?: string;
  uri?: string;
  children?: ReactNode;
}
type AgreeType = 'isFirst' | 'isSecond';

const SignUp = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);
  const [signUpData, setSignUpData] = useState<SignUpDataProps>(getInitialSignUpData());

  const [defaultModalState, setDefaultModalState] = useState<ModalProps>({isVisible: false});
  const [isCertification, setIsCertification] = useState(false); // 휴대폰 인증 완료 여부
  const [samePassword, setSamePassword] = useState(false);
  const [isAgree, setIsAgree] = useState<Record<AgreeType, boolean>>({
    isFirst: false,
    isSecond: false,
  });

  const {signUpCheckPhone} = useReqSignUpPhone();
  const {signUpTAS} = useReqSignUpTAS();
  const {smsConfirm} = useReqSMSConfirm();
  const {signUp} = useReqSignUp();

  // 입력 확인 알럿 메세지
  const validateAndSetModal = (isValid: boolean, message: string) => {
    if (!isValid) {
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message,
      });
    }
    return isValid;
  };

  // 휴대폰 인증 관련 정보 입력 확인
  const userValidations = [
    {isValid: checkName(signUpData.name), message: '이름을 확인해주세요.'},
    {isValid: checkDate(signUpData.birthday), message: '생년월일을 확인해주세요.'},
    {isValid: !!signUpData.gender, message: '성별을 선택하세요.'},
    {isValid: checkPhone(signUpData.phone), message: '휴대폰번호를 확인해주세요.'},
    {isValid: !!signUpData.telecom, message: '통신사를 선택하세요.'},
  ];

  // 비밀번호 입력 및 약관 동의 확인
  const completeValidations = [
    {isValid: !isCertification || !signUpData.code, message: '휴대폰 인증을 먼저 진행해주세요.'},
    {
      isValid: !checkPassword(signUpData.password) || !samePassword,
      message: '비밀번호를 확인해주세요.',
    },
    {isValid: areAllValuesTrue(isAgree), message: '약관에 모두 동의해주세요.'},
  ];

  // 인증하기 클릭
  const onPressCertification = async () => {
    for (const {isValid, message} of userValidations) {
      if (!validateAndSetModal(isValid, message)) return;
    }

    const {phone, name, gender, birthday, telecom} = signUpData;
    const payload = {
      phone,
      name,
      telecom,
      gender: gender as GenderType,
      birth: birthday.substring(2),
    };

    try {
      // 1. 휴대폰 중복체크
      const checkPhoneResponse = await signUpCheckPhone(signUpData.phone);
      // 2. TAS 체크
      const tasResponse = await signUpTAS(payload);
      const code = tasResponse.code;

      if (checkPhoneResponse.code === '0000' && code) {
        // 3. TAS 까지 성공 시 SMS 앱 오픈하여 코드 전송
        setSignUpData(prev => ({...prev, code}));
        setGlobalModalState({
          isVisible: true,
          title: '휴대폰 본인 확인 안내',
          children: <SmsGuide />,
          onPressConfirm: () => {
            openSMS(Config.SMS_PHONE, code);
          },
        });
      }
    } catch (error) {
      await setAttToCrashlytics(payload);
      errorToCrashlytics(error, 'requestSignupTAS');
    }
  };

  // 문자 메세지 앱 이동 / 복귀 리스너
  const handleAppStateChange = async (state: AppStateStatus) => {
    const {phone, code} = signUpData;
    if (state === 'active' && code) {
      // 4. SMS 전송 여부 검증
      const payload = {phone, code};
      try {
        await smsConfirm(payload);
        setIsCertification(true); // 5. 성공 시 비밀번호 입력 화면 표시
      } catch (error) {
        await setAttToCrashlytics(payload);
        errorToCrashlytics(error, 'requestSignupConfirmSMS');
      }
    }
  };

  // 6. 가입하기 클릭
  const onPressSignUp = async () => {
    for (const {isValid, message} of completeValidations) {
      if (!validateAndSetModal(isValid, message)) return;
    }

    const {password, code = ''} = signUpData;
    try {
      await signUp({password, code});
      navigation.navigate('SignIn');
    } catch (error: any) {
      errorToCrashlytics(error, 'requestSignUp');
    }
  };

  // 약관 보기 (웹뷰)
  const onPressFirstCheckModal = (type: 'service' | 'personal') => {
    const agreeType = {
      service: {title: '서비스 이용약관 동의', uri: TermsOfServiceUrl},
      personal: {title: '개인정보 수집 이용 동의', uri: PersonalInformationUrl},
    };
    setDefaultModalState({
      isVisible: true,
      ...agreeType[type],
    });
  };

  useEffect(() => {
    // 앱 백그라운드/활성화 확인 이벤트 리스너
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // 비밀번호와 재입력 비밀번호 비교
    const {password, rePassword} = signUpData;
    if (password && rePassword) {
      const isSame = password === rePassword && checkPassword(rePassword);
      setSamePassword(isSame);
    }
  }, [signUpData.password, signUpData.rePassword]);

  return (
    <CSafeAreaView>
      <Header title="회원가입" navigation={navigation} isBack />
      <CView>
        <ProgressBar progress={isCertification ? 0.95 : 0.05} />
        <CustomScrollView contentContainerStyle={{flex: 1}}>
          {!isCertification ? (
            <View>
              <CText
                text="휴대폰 인증을 진행합니다."
                fontSize={20}
                fontWeight="700"
                style={{marginBottom: 25}}
              />
              <CInput
                title="성명"
                inputValue={signUpData.name}
                setInputValue={value => setSignUpData(prev => ({...prev, name: value}))}
                errorMessage="이름을 확인해 주세요."
                isWarning={!!signUpData.name && !checkName(signUpData.name)}
                maxLength={4}
                inputMode="text"
                readOnly={isCertification}
              />
              <View style={[styles.inputRow, {zIndex: 3}]}>
                <CInputWithDropdown
                  title="생년월일"
                  inputValue={signUpData.birthday}
                  setInputValue={value => setSignUpData(prev => ({...prev, birthday: value}))}
                  placeholder={REQ_DATE_FORMAT}
                  errorMessage="생년월일을 확인해 주세요."
                  maxLength={8}
                  inputMode="numeric"
                  readOnly={isCertification}
                  dropDownItems={GENDER_LIST}
                  dropDownOnSelect={value =>
                    setSignUpData(prev => ({
                      ...prev,
                      gender: value.id,
                    }))
                  }
                  dropDownDisabled={isCertification}
                  dropDownPlaceHolder="성별"
                  isWarning={!!signUpData.birthday && !checkDate(signUpData.birthday)}
                />
              </View>
              <View style={[styles.inputRow, {zIndex: 2}]}>
                <CInputWithDropdown
                  title="휴대폰 번호"
                  inputValue={signUpData.phone}
                  setInputValue={value => setSignUpData(prev => ({...prev, phone: value}))}
                  placeholder="01012341234"
                  errorMessage="휴대폰 번호를 확인해 주세요."
                  isWarning={!!signUpData.phone && !checkPhone(signUpData.phone)}
                  maxLength={11}
                  inputMode="tel"
                  readOnly={isCertification}
                  dropDownItems={TELECOM_LIST}
                  dropDownOnSelect={value => setSignUpData(prev => ({...prev, telecom: value.id}))}
                  dropDownDisabled={isCertification}
                  dropDownPlaceHolder="통신사(알뜰포함)"
                />
              </View>
              <CButton text="인증하기" onPress={onPressCertification} />
            </View>
          ) : (
            <>
              <CText
                text="회원가입의 마지막 단계입니다."
                fontSize={20}
                fontWeight="700"
                style={{marginBottom: 25}}
              />
              <CInput
                title="비밀번호 입력"
                inputValue={signUpData.password}
                setInputValue={value => setSignUpData(prev => ({...prev, password: value}))}
                errorMessage="영문+숫자 조합 8자리 이상 입력해 주세요."
                isWarning={!!signUpData.password && !checkPassword(signUpData.password)}
                secureTextEntry
                placeholder="영문+숫자 조합 8자리 이상"
              />
              <CInput
                title="비밀번호 입력 확인"
                inputValue={signUpData.rePassword}
                setInputValue={value => setSignUpData(prev => ({...prev, rePassword: value}))}
                errorMessage="동일한 비밀번호를 입력해 주세요."
                isWarning={!!signUpData.rePassword && !samePassword}
                secureTextEntry
                placeholder="영문+숫자 조합 8자리 이상"
              />
              <Checkbox
                isChecked={areAllValuesTrue(isAgree)}
                onValueChangeHandler={checked => setIsAgree({isFirst: checked, isSecond: checked})}
                labelMessage="전체동의"
                fontSize={14}
                bold
              />
              <Checkbox
                isChecked={isAgree.isFirst}
                onValueChangeHandler={checked => setIsAgree(prev => ({...prev, isFirst: checked}))}
                labelMessage="서비스 이용약관 동의">
                <Pressable onPress={() => onPressFirstCheckModal('service')}>
                  <CText text="[보기]" fontWeight="600" fontSize={12} />
                </Pressable>
              </Checkbox>
              <Checkbox
                isChecked={isAgree.isSecond}
                onValueChangeHandler={checked => setIsAgree(prev => ({...prev, isSecond: checked}))}
                labelMessage="개인정보 수집 이용 동의">
                <Pressable onPress={() => onPressFirstCheckModal('personal')}>
                  <CText text="[보기]" fontWeight="600" fontSize={12} />
                </Pressable>
              </Checkbox>
              <CButton text="가입하기" onPress={onPressSignUp} />
            </>
          )}
        </CustomScrollView>
      </CView>
      <DefaultModal
        onPressCancel={isVisible => {
          setDefaultModalState({isVisible: isVisible, title: '', uri: ''});
        }}
        isVisible={defaultModalState.isVisible}
        title={defaultModalState.title}>
        {defaultModalState.uri && <CWebView uri={defaultModalState.uri} />}
        {defaultModalState.children}
      </DefaultModal>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default SignUp;
