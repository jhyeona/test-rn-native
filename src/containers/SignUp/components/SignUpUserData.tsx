import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {useSetRecoilState} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CInput from '#components/common/CustomInput/CInput.tsx';
import {CustomScrollView} from '#components/common/CustomScrollComponents';
import CText from '#components/common/CustomText/CText.tsx';
import CInputWithDropdown from '#components/User/CInputWithDropdown.tsx';
import {REQ_DATE_FORMAT} from '#constants/common.ts';
import {GENDER_LIST, TELECOM_LIST} from '#constants/user.ts';
import {useReqSignUpTAS} from '#containers/SignUp/hooks/useApi.ts';
import {useChangeWidth} from '#hooks/useGlobal.ts';
import GlobalState from '#recoil/Global';
import {sentryCaptureException} from '#services/sentry.ts';
import {SignUpDataProps} from '#types/signup.ts';
import {GenderType} from '#types/user.ts';
import {checkDate, checkName} from '#utils/regExpHelper.ts';

const SignUpUserData = ({
  signUpData,
  setSignUpData,
  isChangePhone,
}: {
  signUpData: SignUpDataProps;
  setSignUpData: Dispatch<SetStateAction<SignUpDataProps>>;
  isChangePhone?: boolean;
}) => {
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);

  const {signUpTAS} = useReqSignUpTAS(isChangePhone);
  const width = useChangeWidth();

  // 휴대폰 인증 관련 정보 입력 확인
  const userValidations = [
    {isValid: checkName(signUpData.name), message: '이름을 확인해주세요.'},
    {isValid: checkDate(signUpData.birthday), message: '생년월일을 확인해주세요.'},
    {isValid: !!signUpData.gender, message: '성별을 선택하세요.'},
    {isValid: !!signUpData.phone, message: '휴대폰번호를 확인해주세요.'},
    {isValid: !!signUpData.telecom, message: '통신사를 선택하세요.'},
  ];

  // 인증하기 클릭
  const onPressCertification = async () => {
    for (const {isValid, message} of userValidations) {
      if (!isValid) {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message,
        });
        return;
      }
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
      const tasResponse = await signUpTAS(payload);
      setSignUpData(prev => ({...prev, code: tasResponse.code}));
    } catch (error) {
      sentryCaptureException({error, payload, eventName: 'requestTAS'});
    }
  };

  useEffect(() => {}, [signUpData.phone]);
  return (
    <View style={{width: width}}>
      <CustomScrollView>
        <CText
          text="본인인증을 진행하세요."
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
          maxLength={16}
          inputMode="text"
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
            dropDownItems={GENDER_LIST}
            dropDownOnSelect={value =>
              setSignUpData(prev => ({
                ...prev,
                gender: value.id,
              }))
            }
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
            isWarning={signUpData.phone.length > 0 && signUpData.phone.length < 10}
            maxLength={11}
            inputMode="tel"
            dropDownItems={TELECOM_LIST}
            dropDownOnSelect={value => setSignUpData(prev => ({...prev, telecom: value.id}))}
            dropDownPlaceHolder="통신사(알뜰포함)"
            visiblePosition="relative"
          />
        </View>
      </CustomScrollView>
      <CButton text="본인인증하기" onPress={onPressCertification} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SignUpUserData;
