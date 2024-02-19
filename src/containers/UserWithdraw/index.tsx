import React, {useEffect, useState} from 'react';
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import Header from '../../components/common/Header/Header.tsx';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import CText from '../../components/common/CustomText/CText.tsx';
import CView from '../../components/common/CommonView/CView.tsx';
import {View} from 'react-native';
import CButton from '../../components/common/CommonButton/CButton.tsx';
import Checkbox from '../../components/common/Checkbox/Checkbox.tsx';
import CInput from '../../components/common/CustomInput/CInput.tsx';
import TextList from '../../components/common/TextList/TextList.tsx';
import {withdrawPolicyList} from '../../constants/policy.ts';
import {checkPassword} from '../../utils/regExpHelper.ts';

const UserWithdraw = ({
  navigation,
}: {
  navigation: NativeStackNavigationHelpers;
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordWarning, setIsPasswordWarning] = useState(false);

  const onPressWithdraw = () => {
    //
  };

  useEffect(() => {
    setIsPasswordWarning(!!password && !checkPassword(password));
  }, [password]);

  return (
    <CSafeAreaView>
      <Header title="회원탈퇴" isBack navigation={navigation} />
      <CView>
        <View style={{flexDirection: 'row', marginBottom: 8}}>
          <CText text="체크히어" fontSize={20} fontWeight="700" />
          <CText text={`를 탈퇴하기 전에`} fontSize={20} />
        </View>
        <CText text={`아래 정보를 확인해 주세요.`} fontSize={20} />
        <TextList textList={withdrawPolicyList} style={{marginVertical: 15}} />
        <Checkbox
          isChecked={isChecked}
          onValueChangeHandler={setIsChecked}
          labelMessage="회원탈퇴 유의사항을 확인하였으며, 동의합니다."
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
        <View
          style={{
            alignSelf: 'center',
            width: '100%',
            position: 'absolute',
            bottom: 30,
          }}>
          <CButton
            text="탈퇴하기"
            onPress={onPressWithdraw}
            disabled={!isChecked}
          />
        </View>
      </CView>
    </CSafeAreaView>
  );
};

export default UserWithdraw;
