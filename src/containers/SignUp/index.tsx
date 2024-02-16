import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  checkDate,
  checkName,
  checkPassword,
  checkPhone,
} from '../../utils/regExpHelper.ts';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {
  postSignUp,
  postSignUpPhone,
  postSignUpSMS,
  postSignUpSMSConfirm,
  postSignUpTAS,
} from '../../hooks/useSignUp.ts';
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import CView from '../../components/common/CommonView/CView.tsx';
import Header from '../../components/common/Header/Header.tsx';
import CInput from '../../components/common/CustomInput/CInput.tsx';
import Checkbox from '../../components/common/Checkbox/Checkbox.tsx';
import CButton from '../../components/common/CommonButton/CButton.tsx';
import CText from '../../components/common/CustomText/CText.tsx';
import CInputWithDropdown from '../../components/User/CInputWithDropdown.tsx';
import {useSetRecoilState} from 'recoil';
import globalState from '../../recoil/Global';
import CInputWithTimer from '../../components/User/CInputWithTimer.tsx';
import WebView from 'react-native-webview';
import DefaultModal from '../../components/common/Modal/DefaultModal.tsx';
import {COLORS} from '../../constants/colors.ts';
import absoluteFillObject = StyleSheet.absoluteFillObject;

const SignUp = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const setGlobalModalState = useSetRecoilState(globalState.globalModalState);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [telecom, setTelecom] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [isTimer, setIsTimer] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [restartTimer, setRestartTimer] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [isCertification, setIsCertification] = useState(false);
  const [samePassword, setSamePassword] = useState(false);
  const [isFirstChecked, setIsFirstChecked] = useState(true);
  const [isSecondChecked, setIsSecondChecked] = useState(true);
  const [isAllCheck, setIsAllCheck] = useState(
    isFirstChecked && isSecondChecked,
  );
  const [defaultModalState, setDefaultModalState] = useState({
    isVisible: false,
    title: '',
    uri: '',
  });

  const genderList = [
    // 성별 선택 드롭다운
    {label: '남', id: 'M'},
    {label: '여', id: 'F'},
  ];
  const onChangeGenderValue = (value: {label: string; id: string}) => {
    // 성별 선택
    setGender(value.id);
  };

  const telecomList = [
    // 통신사 선택 드롭다운
    {label: 'SKT', id: 'SKT'},
    {label: 'KT', id: 'KT'},
    {label: 'LG U+', id: 'LGT'},
  ];

  const onChangeTelecomValue = (value: {label: string; id: string}) => {
    // 통신사 선택
    setTelecom(value.id);
  };

  const validateAndSetModal = (isValid: boolean, message: string) => {
    if (!isValid) {
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: `${message} 확인해주세요.`,
      });
      return false;
    }
    return true;
  };

  const doubleCheckPhone = async () => {
    // 휴대폰 번호 중복 확인
    if (!checkPhone(phone)) {
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '올바른 휴대폰 번호를 입력하세요.',
      });
      return;
    }
    try {
      await postSignUpPhone(phone);
      return true;
    } catch (error) {
      return false;
    }
  };

  const tasCertification = async () => {
    // TAS 인증
    const data = {
      phone: phone,
      name: name,
      gender: gender,
      birth: birthday.substring(2),
      telecom: telecom,
    };

    try {
      const response = await postSignUpTAS(data);
      if (response?.code === '0000') {
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const smsCertification = async () => {
    // SMS 인증 요청
    const data = {phone: phone};
    try {
      const response = await postSignUpSMS(data);
      if (response) {
        setSmsCode('');
        setIsSend(true);
        setIsTimer(true);
        setRestartTimer(true);
      }
    } catch (e) {
      console.log(e);
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: 'SMS 인증 요청에 실패했습니다.',
      });
    }
  };

  const handleConfirm = async (code: string) => {
    // SMS 인증 완료 요청
    const data = {
      phone: phone,
      verifyCode: code,
    };

    try {
      await postSignUpSMSConfirm(data);
      setIsCertification(true);
    } catch (error) {
      console.log(error);
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '인증에 실패했습니다. \n정보를 확인해주세요.',
      });
    }
  };

  const onPressCertification = async () => {
    // 전체 인증 요청
    if (!validateAndSetModal(checkName(name), '이름을')) return;
    if (!validateAndSetModal(checkDate(birthday), '생년월일을')) return;
    if (!validateAndSetModal(!!gender, '성별을')) return;
    if (!validateAndSetModal(checkPhone(phone), '휴대폰번호를')) return;
    if (!validateAndSetModal(!!telecom, '통신사를')) return;

    const isDoubleCheckPhone = await doubleCheckPhone();
    if (!isDoubleCheckPhone) {
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '이미 사용중인 휴대폰 번호입니다.',
      });
      setIsSend(false);
      return;
    }

    const resultTasCertification = await tasCertification();
    if (!resultTasCertification) {
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '인증에 실패했습니다.\n정보를 확인해주세요.',
      });
      setIsSend(false);
      return;
    }

    await smsCertification();
  };

  const onPressFirstCheckModal = () => {
    setDefaultModalState({
      isVisible: true,
      title: '서비스 이용약관 동의',
      uri: 'https://www.lfin.kr/33',
    });
  };

  const onPressSecondCheckModal = () => {
    setDefaultModalState({
      isVisible: true,
      title: '개인정보 수집 이용 동의',
      uri: 'https://www.lfin.kr/31',
    });
  };

  const onPressSignUp = async () => {
    // 가입하기 버튼 클릭
    if (!isCertification) {
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '휴대폰 인증을 먼저 진행해주세요.',
      });
      return;
    }

    if (
      !validateAndSetModal(
        checkPassword(password) || samePassword,
        '비밀번호를',
      )
    ) {
      return;
    }

    if (!isFirstChecked || !isSecondChecked) {
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '약관에 모두 동의해주세요.',
      });
      return;
    }

    // 회원가입 진행
    const data = {
      phone: phone,
      name: name,
      birth: birthday.substring(2),
      password: password,
      gender: gender,
    };

    try {
      await postSignUp(data);
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message: '회원가입이 완료되었습니다. 로그인해 주세요.',
      });
      navigation.navigate('SignIn');
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleChangeSmsCode = async (value: string) => {
    // 인증번호 입력
    setSmsCode(value);
    if (value.length === 6) {
      await handleConfirm(value);
    }
  };

  const onChangeTimeHandler = (time: number) => {
    if (time > 99) {
      setRestartTimer(false);
      setCountDown(time);
    }
    if (time === 0) {
      setIsTimer(false);
    }
  };

  const handleAllChecked = (isChecked: boolean) => {
    // 전체 동의
    setIsAllCheck(isChecked);
    setIsFirstChecked(isChecked);
    setIsSecondChecked(isChecked);
  };

  const updateAllCheckState = (
    firstChecked: boolean,
    secondChecked: boolean,
  ) => {
    // 하나씩 동의
    setIsAllCheck(firstChecked && secondChecked);
  };

  useEffect(() => {
    // 비밀번호와 재입력 비밀번호 비교
    const isSame = password === rePassword && checkPassword(rePassword);
    setSamePassword(isSame);
  }, [password, rePassword]);

  return (
    <CSafeAreaView>
      <Header title="회원가입" navigation={navigation} isBack />
      <CView>
        <ScrollView>
          <CInput
            title="성명"
            inputValue={name}
            setInputValue={setName}
            errorMessage="이름을 입력해 주세요."
            isWarning={name.length > 0 && !checkName(name)}
            maxLength={4}
            inputMode="text"
            readOnly={isSend}
          />
          <View style={[styles.inputRow, {zIndex: 3}]}>
            <CInputWithDropdown
              title="생년월일"
              inputValue={birthday}
              setInputValue={setBirthday}
              placeholder="YYYYMMDD"
              errorMessage="생년월일을 입력해 주세요."
              dropDownItems={genderList}
              dropDownOnSelect={onChangeGenderValue}
              dropDownDisabled={isSend}
              dropDownPlaceHolder="성별"
              isWarning={birthday.length > 0 && !checkDate(birthday)}
              maxLength={8}
              inputMode="numeric"
              readOnly={isSend}
              dropDownStyle={{flex: 1}}
            />
          </View>
          <View style={[styles.inputRow, {zIndex: 2}]}>
            <CInputWithDropdown
              title="휴대폰 번호"
              inputValue={phone}
              setInputValue={setPhone}
              placeholder="01012341234"
              errorMessage="휴대폰 번호를 바르게 입력해 주세요."
              isWarning={phone.length > 0 && !checkPhone(phone)}
              maxLength={11}
              inputMode="tel"
              readOnly={isSend}
              dropDownItems={telecomList}
              dropDownOnSelect={onChangeTelecomValue}
              dropDownDisabled={isSend}
              dropDownPlaceHolder="통신사"
              dropDownStyle={{flex: 1}}
            />
          </View>
          <View style={styles.inputRow}>
            <CInputWithTimer
              title="인증번호"
              inputValue={smsCode}
              setInputValue={handleChangeSmsCode}
              errorMessage="올바른 인증번호를 입력해 주세요."
              isWarning={
                isSend ? smsCode.length > 0 && smsCode.length < 6 : false
              }
              maxLength={6}
              inputMode="numeric"
              readOnly={!isSend || isCertification}
              timer={isTimer}
              onChangeTimeHandler={onChangeTimeHandler}
              setTime={120}
              restart={restartTimer}
            />
            <View style={{width: '40%'}}>
              {isSend ? (
                <CButton
                  text={isCertification ? '인증 완료' : '재발송'}
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
            inputValue={password}
            setInputValue={setPassword}
            errorMessage="영문+숫자 조합 8자리 이상 입력해 주세요."
            isWarning={password.length > 0 && !checkPassword(password)}
            secureTextEntry
            placeholder="영문+숫자 조합 8자리 이상"
          />
          <CInput
            title="비밀번호 입력 확인"
            inputValue={rePassword}
            setInputValue={setRePassword}
            errorMessage="동일한 비밀번호를 입력해 주세요."
            isWarning={rePassword.length > 0 && !samePassword}
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
        <WebView
          source={{uri: defaultModalState.uri}}
          startInLoadingState={true}
          originWhitelist={['*']}
          renderLoading={() => (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{...absoluteFillObject}}
            />
          )}
        />
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
