import React, {Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {useSetRecoilState} from 'recoil';

import Checkbox from '#components/common/Checkbox/Checkbox.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CInput from '#components/common/CustomInput/CInput.tsx';
import {CustomScrollView} from '#components/common/CustomScrollComponents';
import CText from '#components/common/CustomText/CText.tsx';
import DefaultModal from '#components/common/Modal/DefaultModal.tsx';
import CWebView from '#components/common/WebView/CWebView.tsx';
import {PersonalInformationUrl, TermsOfLocationUrl, TermsOfServiceUrl} from '#constants/policy.ts';
import {useReqSignUp} from '#containers/SignUp/hooks/useApi.ts';
import {useChangeWidth} from '#hooks/useGlobal.ts';
import GlobalState from '#recoil/Global';
import {sentryCaptureException} from '#services/sentry.ts';
import {SignUpDataProps} from '#types/signup.ts';
import {areAllValuesTrue} from '#utils/objectHelper.ts';
import {checkPassword} from '#utils/regExpHelper.ts';

interface ModalProps {
  isVisible: boolean;
  title?: string;
  uri?: string;
  children?: ReactNode;
}

const SignUpUserPassword = ({
  signUpData,
  setSignUpData,
  navigation,
}: {
  signUpData: SignUpDataProps;
  setSignUpData: Dispatch<SetStateAction<SignUpDataProps>>;
  navigation: NativeStackNavigationHelpers;
}) => {
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);
  const [defaultModalState, setDefaultModalState] = useState<ModalProps>({isVisible: false});

  const [samePassword, setSamePassword] = useState(false);
  const [isAgree, setIsAgree] = useState<Record<string, boolean>>({
    isFirst: false,
    isSecond: false,
    isThird: false,
  });

  const {signUp} = useReqSignUp();
  const width = useChangeWidth();

  // 비밀번호 입력 및 약관 동의 확인
  const completeValidations = [
    {
      isValid: checkPassword(signUpData.password) && samePassword,
      message: '비밀번호를 확인해주세요.',
    },
    {isValid: areAllValuesTrue(isAgree), message: '약관에 모두 동의해주세요.'},
  ];

  // 약관 보기 (웹뷰)
  const onPressFirstCheckModal = (type: 'service' | 'personal' | 'location') => {
    const agreeType = {
      service: {title: '서비스 이용약관 동의', uri: TermsOfServiceUrl},
      location: {title: '위치기반 서비스 이용약관 동의', uri: TermsOfLocationUrl},
      personal: {title: '개인정보 수집 이용 동의', uri: PersonalInformationUrl},
    };
    setDefaultModalState({
      isVisible: true,
      ...agreeType[type],
    });
  };

  // 가입하기 클릭
  const onPressSignUp = async () => {
    for (const {isValid, message} of completeValidations) {
      if (!isValid) {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message,
        });
        return;
      }
    }

    const {password, code = '', phone} = signUpData;
    try {
      await signUp({password, code});
      navigation.navigate('SignIn');
    } catch (error: any) {
      sentryCaptureException({error, payload: {phone}, eventName: 'requestSignUp'});
    }
  };

  useEffect(() => {
    // 비밀번호와 재입력 비밀번호 비교
    const {password, rePassword} = signUpData;
    if (password && rePassword) {
      const isSame = password === rePassword && checkPassword(rePassword);
      setSamePassword(isSame);
    }
  }, [signUpData.password, signUpData.rePassword]);

  return (
    <>
      <View style={{width: width}}>
        <CustomScrollView>
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
            onValueChangeHandler={checked =>
              setIsAgree({isFirst: checked, isSecond: checked, isThird: checked})
            }
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
            labelMessage="위치기반 서비스 이용약관 동의">
            <Pressable onPress={() => onPressFirstCheckModal('location')}>
              <CText text="[보기]" fontWeight="600" fontSize={12} />
            </Pressable>
          </Checkbox>
          <Checkbox
            isChecked={isAgree.isThird}
            onValueChangeHandler={checked => setIsAgree(prev => ({...prev, isThird: checked}))}
            labelMessage="개인정보 수집 이용 동의">
            <Pressable onPress={() => onPressFirstCheckModal('personal')}>
              <CText text="[보기]" fontWeight="600" fontSize={12} />
            </Pressable>
          </Checkbox>
        </CustomScrollView>
        <CButton text="가입하기" onPress={onPressSignUp} />
      </View>

      <DefaultModal
        onPressCancel={isVisible => {
          setDefaultModalState({isVisible: isVisible, title: '', uri: ''});
        }}
        isVisible={defaultModalState.isVisible}
        title={defaultModalState.title}>
        {defaultModalState.uri && <CWebView uri={defaultModalState.uri} />}
        {defaultModalState.children}
      </DefaultModal>
    </>
  );
};

export default SignUpUserPassword;
