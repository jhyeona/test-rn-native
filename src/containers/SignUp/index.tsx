import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {useSetRecoilState} from 'recoil';

import Checkbox from '#components/common/Checkbox/Checkbox.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CInput from '#components/common/CustomInput/CInput.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import DefaultModal from '#components/common/Modal/DefaultModal.tsx';
import CWebView from '#components/common/WebView/CWebView.tsx';
import CInputWithDropdown from '#components/User/CInputWithDropdown.tsx';
import CInputWithTimer from '#components/User/CInputWithTimer.tsx';
import {PersonalInformationUrl, TermsOfServiceUrl} from '#constants/policy.ts';
import {GENDER_LIST, TELECOM_LIST} from '#constants/user.ts';
import {
  useReqSignUp,
  useReqSignUpPhone,
  useReqSignUpTAS,
  useReqSMSCode,
  useReqSMSConfirm,
} from '#containers/SignUp/hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import {errorToCrashlytics, setAttToCrashlytics} from '#services/firebase.ts';
import {GenderType} from '#types/user.ts';
import {
  checkDate,
  checkName,
  checkPassword,
  checkPhone,
} from '#utils/regExpHelper.ts';

interface SignUpDataProps {
  name: string;
  birthday: string;
  gender: string;
  phone: string;
  telecom: string;
  smsCode: string;
  password: string;
  rePassword: string;
}
const TEST_PHONE = '01072337376';

const SignUp = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);
  // TODO: useForm 사용 예정
  const [signUpData, setSignUpData] = useState<SignUpDataProps>({
    name: '',
    birthday: '',
    phone: '',
    gender: '',
    telecom: '',
    smsCode: '',
    password: '',
    rePassword: '',
  });

  const [isTimer, setIsTimer] = useState(false);
  const [countDown, setCountDown] = useState(0); // 휴대폰 인증 유효 시간 카운트다운
  const [restartTimer, setRestartTimer] = useState(false); // 휴대폰 인증 코드 다시 보내기 가능 여부
  const [isSend, setIsSend] = useState(false); // 휴대폰 인증 문자 발송 여부
  const [isCertification, setIsCertification] = useState(false); // 휴대폰 인증 완료 여부
  const [samePassword, setSamePassword] = useState(false);
  const [isFirstChecked, setIsFirstChecked] = useState(false);
  const [isSecondChecked, setIsSecondChecked] = useState(false);
  const [isAllCheck, setIsAllCheck] = useState(
    isFirstChecked && isSecondChecked,
  );
  const [defaultModalState, setDefaultModalState] = useState({
    isVisible: false,
    title: '',
    uri: '',
  });

  const {signUpCheckPhone} = useReqSignUpPhone();
  const {signUpTAS} = useReqSignUpTAS();
  const {signUpReqSmsCode} = useReqSMSCode();
  const {smsConfirm} = useReqSMSConfirm();
  const {signUp} = useReqSignUp();

  // modal 사용 시 message 만 입력
  const commonModal = (message: string) => {
    setGlobalModalState({
      isVisible: true,
      title: '안내',
      message: message,
    });
  };

  // 휴대폰 인증 시 입력 확인 메세지
  const validateAndSetModal = (isValid: boolean, message: string) => {
    if (!isValid) {
      commonModal(`휴대폰 인증을 위해\n${message} 확인해주세요.`);
      return false;
    }
    return true;
  };

  // 입력 확인 조건 체크
  const validations = [
    {isValid: checkName(signUpData.name), message: '이름을'},
    {isValid: checkDate(signUpData.birthday), message: '생년월일을'},
    {isValid: !!signUpData.gender, message: '성별을'},
    {isValid: checkPhone(signUpData.phone), message: '휴대폰번호를'},
    {isValid: !!signUpData.telecom, message: '통신사를'},
  ];

  // 인증 문자 발송 클릭
  const onPressCertification = async () => {
    for (const {isValid, message} of validations) {
      if (!validateAndSetModal(isValid, message)) return;
    }
    // === FOR APP STORE TEST DATA ===
    if (signUpData.phone === TEST_PHONE) {
      commonModal('인증 문자가 발송되었습니다.');
      setSignUpData(prev => ({...prev, smsCode: ''}));
      setIsSend(true);
      setIsTimer(true);
      setRestartTimer(true);
      return;
    } // ===  FOR APP STORE TEST DATA ===

    setIsCertification(true); // TAS 가 딜레이 되는 동안 입력 및 버튼 disabled 처리
    setIsSend(true);

    const payload = {
      phone: signUpData.phone,
      name: signUpData.name,
      gender: signUpData.gender as GenderType,
      birth: signUpData.birthday.substring(2),
      telecom: signUpData.telecom,
    };

    try {
      const checkPhoneResponse = await signUpCheckPhone(signUpData.phone);
      const tasResponse = await signUpTAS(payload);

      if (checkPhoneResponse?.code === '0000' && tasResponse?.code === '0000') {
        setIsCertification(false);
        // SMS 인증 요청
        await requestSmsCode();
      }
    } catch (error) {
      setIsCertification(false);
      setIsSend(false);
      await setAttToCrashlytics(payload);
      errorToCrashlytics(error, 'requestSignupTAS');
    }
  };

  // SMS 인증 문자 요청
  const requestSmsCode = async () => {
    const payload = {phone: signUpData.phone};
    try {
      await signUpReqSmsCode(payload);
      setSignUpData(prev => ({...prev, smsCode: ''}));
      setIsTimer(true);
      setRestartTimer(true);
    } catch (error) {
      setIsSend(false);
      errorToCrashlytics(error, 'requestSignupSendSMS');
    }
  };

  // 인증번호 입력 + 자동 확인
  const handleChangeSmsCode = async (value: string) => {
    setSignUpData(prev => ({...prev, smsCode: value}));
    if (value.length === 6) {
      // === FOR APP STORE TEST DATA ===
      if (signUpData.phone === TEST_PHONE) {
        setIsCertification(true);
        setIsTimer(false);
        return;
      } // === FOR APP STORE TEST DATA ===

      const payload = {
        phone: signUpData.phone,
        verifyCode: value,
      };
      try {
        await smsConfirm(payload);
        setIsCertification(true);
        setIsTimer(false);
      } catch (error) {
        await setAttToCrashlytics(payload);
        errorToCrashlytics(error, 'requestSignupConfirmSMS');
      }
    }
  };

  // 가입하기 클릭
  const onPressSignUp = async () => {
    // 가입하기 버튼 클릭
    if (!isCertification) {
      commonModal('휴대폰 인증을 먼저 진행해주세요.');
      return;
    }
    if (!checkPassword(signUpData.password) || !samePassword) {
      commonModal('비밀번호를 확인해주세요.');
      return;
    }
    if (!isFirstChecked || !isSecondChecked) {
      commonModal('약관에 모두 동의해주세요.');
      return;
    }

    // 회원가입 진행
    const payload = {
      phone: signUpData.phone,
      name: signUpData.name,
      birth: signUpData.birthday?.substring(2),
      password: signUpData.password,
      gender: signUpData.gender as GenderType,
    };

    try {
      await signUp(payload);
      navigation.navigate('SignIn');
    } catch (error: any) {
      errorToCrashlytics(error, 'requestSignUp');
    }
  };

  // 인증 문자 시간
  const onChangeTimeHandler = (time: number) => {
    if (time > 99) {
      setRestartTimer(false);
      setCountDown(time);
    }
    if (time === 0) {
      setIsTimer(false);
    }
  };

  // 서비스 이용약관 동의
  const onPressFirstCheckModal = () => {
    setDefaultModalState({
      isVisible: true,
      title: '서비스 이용약관 동의',
      uri: TermsOfServiceUrl,
    });
  };

  // 개인정보 수집 이용 동의
  const onPressSecondCheckModal = () => {
    setDefaultModalState({
      isVisible: true,
      title: '개인정보 수집 이용 동의',
      uri: PersonalInformationUrl,
    });
  };

  // 전체 동의
  const handleAllChecked = (isChecked: boolean) => {
    setIsAllCheck(isChecked);
    setIsFirstChecked(isChecked);
    setIsSecondChecked(isChecked);
  };

  // 약관 개별 동의 시 전체 동의 처리
  const updateAllCheckState = (
    firstChecked: boolean,
    secondChecked: boolean,
  ) => {
    // 하나씩 동의
    setIsAllCheck(firstChecked && secondChecked);
  };

  useEffect(() => {
    // 비밀번호와 재입력 비밀번호 비교
    if (signUpData.password && signUpData.rePassword) {
      const isSame =
        signUpData.password === signUpData.rePassword &&
        checkPassword(signUpData.rePassword);
      setSamePassword(isSame);
    }
  }, [signUpData.password, signUpData.rePassword]);

  return (
    <CSafeAreaView>
      <Header title="회원가입" navigation={navigation} isBack />
      <CView>
        <ScrollView>
          <CInput
            title="성명"
            inputValue={signUpData.name}
            setInputValue={value =>
              setSignUpData(prev => ({...prev, name: value}))
            }
            errorMessage="이름을 입력해 주세요."
            isWarning={!!signUpData.name && !checkName(signUpData.name)}
            maxLength={4}
            inputMode="text"
            readOnly={isSend}
          />
          <View style={[styles.inputRow, {zIndex: 3}]}>
            <CInputWithDropdown
              title="생년월일"
              inputValue={signUpData.birthday}
              setInputValue={value =>
                setSignUpData(prev => ({...prev, birthday: value}))
              }
              placeholder="YYYYMMDD"
              errorMessage="생년월일을 입력해 주세요."
              maxLength={8}
              inputMode="numeric"
              readOnly={isSend}
              dropDownItems={GENDER_LIST}
              dropDownOnSelect={value =>
                setSignUpData(prev => ({
                  ...prev,
                  gender: value.id,
                }))
              }
              dropDownDisabled={isSend}
              dropDownPlaceHolder="성별"
              isWarning={
                !!signUpData.birthday && !checkDate(signUpData.birthday)
              }
              dropDownStyle={{flex: 1}}
            />
          </View>
          <View style={[styles.inputRow, {zIndex: 2}]}>
            <CInputWithDropdown
              title="휴대폰 번호"
              inputValue={signUpData.phone}
              setInputValue={value =>
                setSignUpData(prev => ({...prev, phone: value}))
              }
              placeholder="01012341234"
              errorMessage="휴대폰 번호를 바르게 입력해 주세요."
              isWarning={!!signUpData.phone && !checkPhone(signUpData.phone)}
              maxLength={11}
              inputMode="tel"
              readOnly={isSend}
              dropDownItems={TELECOM_LIST}
              dropDownOnSelect={value =>
                setSignUpData(prev => ({...prev, telecom: value.id}))
              }
              dropDownDisabled={isSend}
              dropDownPlaceHolder="통신사(알뜰포함)"
              dropDownStyle={{flex: 1}}
            />
          </View>
          <View style={styles.inputRow}>
            <CInputWithTimer
              title="인증번호"
              inputValue={signUpData.smsCode}
              setInputValue={handleChangeSmsCode}
              errorMessage="올바른 인증번호를 입력해 주세요."
              isWarning={
                isSend
                  ? !!signUpData.smsCode && signUpData.smsCode.length < 6
                  : false
              }
              maxLength={6}
              inputMode="numeric"
              readOnly={false}
              timer={isTimer}
              onChangeTimeHandler={onChangeTimeHandler}
              setTime={120}
              restart={restartTimer}
            />
            <View style={{width: '40%'}}>
              {isSend ? (
                <CButton
                  text={isCertification ? '발송 완료' : '재발송'}
                  onPress={onPressCertification}
                  disabled={countDown > 100 || isCertification}
                />
              ) : (
                <CButton text="인증 문자 발송" onPress={onPressCertification} />
              )}
            </View>
          </View>
          <CInput
            title="비밀번호 입력"
            inputValue={signUpData.password}
            setInputValue={value =>
              setSignUpData(prev => ({...prev, password: value}))
            }
            errorMessage="영문+숫자 조합 8자리 이상 입력해 주세요."
            isWarning={
              !!signUpData.password && !checkPassword(signUpData.password)
            }
            secureTextEntry
            placeholder="영문+숫자 조합 8자리 이상"
          />
          <CInput
            title="비밀번호 입력 확인"
            inputValue={signUpData.rePassword}
            setInputValue={value =>
              setSignUpData(prev => ({...prev, rePassword: value}))
            }
            errorMessage="동일한 비밀번호를 입력해 주세요."
            isWarning={!!signUpData.rePassword && !samePassword}
            secureTextEntry
            placeholder="영문+숫자 조합 8자리 이상"
          />
          <Checkbox
            isChecked={isAllCheck}
            onValueChangeHandler={handleAllChecked}
            labelMessage="전체동의"
            fontSize={14}
            bold
          />
          <Checkbox
            isChecked={isFirstChecked}
            onValueChangeHandler={checked => {
              setIsFirstChecked(checked);
              updateAllCheckState(checked, isSecondChecked);
            }}
            labelMessage="서비스 이용약관 동의">
            <Pressable onPress={onPressFirstCheckModal}>
              <CText text="[보기]" fontWeight="600" fontSize={12} />
            </Pressable>
          </Checkbox>
          <Checkbox
            isChecked={isSecondChecked}
            onValueChangeHandler={checked => {
              setIsSecondChecked(checked);
              updateAllCheckState(isFirstChecked, checked);
            }}
            labelMessage="개인정보 수집 이용 동의">
            <Pressable onPress={onPressSecondCheckModal}>
              <CText text="[보기]" fontWeight="600" fontSize={12} />
            </Pressable>
          </Checkbox>
          <CButton text="가입하기" onPress={onPressSignUp} />
        </ScrollView>
      </CView>
      <DefaultModal
        onPressCancel={isVisible => {
          setDefaultModalState({isVisible: isVisible, title: '', uri: ''});
        }}
        isVisible={defaultModalState.isVisible}
        title={defaultModalState.title}>
        <CWebView uri={defaultModalState.uri} />
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
