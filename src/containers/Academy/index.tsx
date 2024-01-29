import React, {useState} from 'react';
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import Header from '../../components/common/Header/Header.tsx';
import CView from '../../components/common/CommonView/CView.tsx';
import {ScrollView, StyleSheet, View} from 'react-native';
import CButton from '../../components/common/CommonButton/CButton.tsx';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {useRecoilValue} from 'recoil';
import userState from '../../recoil/user';
import {usePreviousScreenName} from '../../hooks/useNavigation.ts';
import CText from '../../components/common/CustomText/CText.tsx';
import CheckboxCircle from '../../components/common/Checkbox/CheckboxCircle.tsx';
import {COLORS} from '../../constants/colors.ts';

const Academy = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const userData = useRecoilValue(userState.userInfoState);
  const prevScreenName = usePreviousScreenName(navigation);
  const infoText = `나를 초대한 기관이에요.\n가입하실 기관을 선택해 주세요. (중복 선택이 가능해요)`;
  const [checkboxState, setCheckboxState] = useState(
    userData?.studentList.map(item => ({...item, isChecked: false})),
  );

  const handleCheckboxChange = (id: number) => {
    setCheckboxState(
      prevState =>
        prevState?.map(item =>
          item.academy.academyId === id
            ? {...item, isChecked: !item.isChecked}
            : item,
        ),
    );
  };

  const onPressSelectAcademy = () => {
    const selectList = checkboxState?.filter(value => {
      return value.isChecked;
    });
    selectList?.map(val => {
      console.log(val.academy.name);
    });
  };

  return (
    <CSafeAreaView>
      <Header
        title="가입기관 선택"
        isBack={!!prevScreenName}
        navigation={navigation}
      />
      <CView>
        <CText text={infoText} fontWeight="600" lineHeight={22.4} />
        <ScrollView style={{marginTop: 30}}>
          {checkboxState?.map((val, index) => {
            return (
              <View
                style={[
                  styles.checkContainer,
                  val.isChecked && styles.isCheckedContainer,
                ]}
                key={index}>
                <CheckboxCircle
                  isChecked={val.isChecked}
                  onValueChangeHandler={checked =>
                    handleCheckboxChange(val.academy.academyId)
                  }
                  labelMessage="기관명 / 초대일시"
                  fontSize={16}
                />
              </View>
            );
          })}
        </ScrollView>
        <CButton text="선택하기" onPress={onPressSelectAcademy} />
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  checkContainer: {
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: COLORS.layout,
    borderRadius: 7,
  },
  isCheckedContainer: {
    backgroundColor: COLORS.light.blue,
    borderColor: COLORS.primary,
  },
});

export default Academy;
