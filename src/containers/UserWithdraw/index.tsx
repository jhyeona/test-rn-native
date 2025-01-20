import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

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
import CKeyboardAvoidingView from '#components/common/Keyboard/CKeyboardAvoidingView.tsx';
import TextList from '#components/common/TextList/TextList.tsx';
import {withdrawPolicyList} from '#constants/policy.ts';
import {useDeleteUser} from '#containers/UserWithdraw/hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import {sentryCaptureException} from '#services/sentry.ts';
import {checkPassword} from '#utils/regExpHelper.ts';

const UserWithdraw = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordWarning, setIsPasswordWarning] = useState(false);

  const {deleteUser} = useDeleteUser();

  const onPressWithdraw = () => {
    if (!password) {
      setIsPasswordWarning(true);
      return;
    }
    setGlobalModalState({
      isVisible: true,
      isConfirm: true,
      title: '안내',
      message: '정말 탈퇴하시겠습니까?',
      onPressConfirm: withdrawConfirm,
    });
  };

  const withdrawConfirm = async () => {
    try {
      await deleteUser({password: password});
    } catch (error: any) {
      if (error.code === '4000') {
        setIsPasswordWarning(true);
        setGlobalModalState({
          isVisible: true,
          title: '오류',
          message: '비밀번호를 확인해주세요.',
        });
        return;
      }
      setGlobalModalState({
        isVisible: true,
        title: '오류',
        message: error.message ?? '탈퇴에 실패했습니다.',
      });
      sentryCaptureException({error, eventName: 'requestUserDelete'});
    }
  };

  useEffect(() => {
    setIsPasswordWarning(!!password && !checkPassword(password));
  }, [password]);

  return (
    <CSafeAreaView>
      <Header title="회원탈퇴" isBack navigation={navigation} />
      <CView>
        <CKeyboardAvoidingView>
          <CustomScrollView>
            <View style={{flexDirection: 'row', marginBottom: 8}}>
              <CText text="여기여기붙어라" fontSize={20} fontWeight="700" />
              <CText text={`를 탈퇴하기 전에`} fontSize={20} />
            </View>
            <CText text={`아래 정보를 확인해 주세요.`} fontSize={20} />
            <TextList textList={withdrawPolicyList} style={{marginVertical: 15}} />
            <Checkbox
              isChecked={isChecked}
              onValueChangeHandler={setIsChecked}
              labelMessage="유의사항을 모두 확인하였으며, 동의합니다."
              fontSize={16}
            />
            <View style={{margin: 10}} />
            <CInput
              title="비밀번호 입력"
              fontSize={16}
              inputValue={password}
              setInputValue={setPassword}
              isWarning={isPasswordWarning}
              errorMessage="비밀번호를 확인해주세요."
              placeholder="현재 비밀번호를 입력해주세요."
              secureTextEntry
            />
            <CButton text="탈퇴하기" onPress={onPressWithdraw} disabled={!isChecked || !password} />
          </CustomScrollView>
        </CKeyboardAvoidingView>
      </CView>
    </CSafeAreaView>
  );
};

export default UserWithdraw;
