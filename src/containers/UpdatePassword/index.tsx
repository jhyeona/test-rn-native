import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import CInput from '#components/common/CustomInput/CInput.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import {checkPassword} from '#utils/regExpHelper.ts';
import {patchUpdatePassword} from '#hooks/useMypage.ts';
import {useSetRecoilState} from 'recoil';
import globalState from '#recoil/Global';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import Header from '#components/common/Header/Header.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import {errorToCrashlytics} from '#services/firebase.ts';

const UpdatePassword = ({
  navigation,
}: {
  navigation: NativeStackNavigationHelpers;
}) => {
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isSamePassword, setIsSamePassword] = useState(true);
  const setModalState = useSetRecoilState(globalState.globalModalState);

  const onPressUpdatePassword = async () => {
    if (
      !checkPassword(password) ||
      !checkPassword(rePassword) ||
      !isSamePassword
    ) {
      return;
    }
    try {
      await patchUpdatePassword({password: password});
      setModalState({
        isVisible: true,
        title: '안내',
        message: '비밀번호가 변경되었습니다.',
      });
      setPassword('');
      setRePassword('');
      navigation.goBack();
    } catch (error: any) {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '비밀번호 변경에 실패했습니다.',
      });
      errorToCrashlytics(error, 'patch update password');
    }
  };

  useEffect(() => {
    // 비밀번호와 재입력 비밀번호 비교
    const isSame = password === rePassword;
    setIsSamePassword(isSame);
  }, [password, rePassword]);

  return (
    <CSafeAreaView>
      <Header title="비밀번호 변경" isBack navigation={navigation} />
      <CView isInput>
        <CInput
          title=""
          inputValue={password}
          setInputValue={setPassword}
          placeholder="영문, 숫자 혼합 8자리 이상"
          errorMessage="비밀번호를 확인하세요."
          isWarning={password.length > 0 && !checkPassword(password)}
          fontSize={16}
          secureTextEntry>
          <CText text="비밀번호 변경" fontSize={20} />
        </CInput>
        <CInput
          title=""
          inputValue={rePassword}
          setInputValue={setRePassword}
          placeholder="한 번 더 입력해주세요."
          errorMessage="비밀번호를 확인하세요."
          isWarning={
            rePassword.length > 0 &&
            (!checkPassword(rePassword) || !isSamePassword)
          }
          fontSize={16}
          secureTextEntry>
          <CText text="비밀번호 변경 확인" fontSize={20} />
        </CInput>
        <CButton text="변경 사항 저장" onPress={onPressUpdatePassword} />
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
});
export default UpdatePassword;
