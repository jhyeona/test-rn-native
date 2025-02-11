import React, {useEffect, useState} from 'react';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {useSetRecoilState} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CInput from '#components/common/CustomInput/CInput.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import {useUpdatePassword} from '#containers/UpdatePassword/hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import {sentryCaptureException} from '#services/sentry.ts';
import {checkPassword} from '#utils/regExpHelper.ts';

const UpdatePassword = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isSamePassword, setIsSamePassword] = useState(true);

  const {updatePassword} = useUpdatePassword();

  const onPressUpdatePassword = async () => {
    if (!checkPassword(password) || !checkPassword(rePassword) || !isSamePassword) {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '비밀번호는 영문, 숫자 혼합 8자리 이상이어야 합니다.',
      });
      return;
    }
    try {
      await updatePassword({password: password});
      setModalState({
        isVisible: true,
        title: '안내',
        message: '비밀번호가 변경되었습니다.',
      });
      setPassword('');
      setRePassword('');
      navigation.goBack();
    } catch (error: any) {
      sentryCaptureException({error, eventName: 'requestUpdatePassword'});
      setModalState({
        isVisible: true,
        title: '안내',
        message: '비밀번호 변경에 실패했습니다.',
      });
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
          inputValue={rePassword}
          setInputValue={setRePassword}
          placeholder="한 번 더 입력해주세요."
          errorMessage="비밀번호를 확인하세요."
          isWarning={rePassword.length > 0 && (!checkPassword(rePassword) || !isSamePassword)}
          fontSize={16}
          secureTextEntry>
          <CText text="비밀번호 변경 확인" fontSize={20} />
        </CInput>
        <CButton text="변경 사항 저장" onPress={onPressUpdatePassword} />
      </CView>
    </CSafeAreaView>
  );
};

export default UpdatePassword;
