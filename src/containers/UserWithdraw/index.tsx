import React, {useState} from 'react';
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import Header from '../../components/common/Header/Header.tsx';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import CText from '../../components/common/CustomText/CText.tsx';
import {COLORS} from '../../constants/colors.ts';
import CView from '../../components/common/CommonView/CView.tsx';
import {View} from 'react-native';
import CButton from '../../components/common/CommonButton/CButton.tsx';
import Checkbox from '../../components/common/Checkbox/Checkbox.tsx';

const UserWithdraw = ({
  navigation,
}: {
  navigation: NativeStackNavigationHelpers;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const onPressWithdraw = () => {
    //
  };
  return (
    <CSafeAreaView>
      <Header title="회원탈퇴" isBack navigation={navigation} />
      <CView>
        <View style={{flexDirection: 'row'}}>
          <CText
            text="체크히어"
            fontSize={20}
            fontWeight="700"
            color={COLORS.primary}
          />
          <CText text={`를 탈퇴하기 전에`} fontSize={20} />
        </View>
        <CText text={`아래 정보를 확인해 주세요.`} fontSize={20} />
        <Checkbox
          isChecked={isChecked}
          onValueChangeHandler={setIsChecked}
          labelMessage="탈퇴 내용에 동의합니다."
          fontSize={16}
        />
        <CButton
          text="탈퇴하기"
          onPress={onPressWithdraw}
          disabled={!isChecked}
        />
      </CView>
    </CSafeAreaView>
  );
};

export default UserWithdraw;
