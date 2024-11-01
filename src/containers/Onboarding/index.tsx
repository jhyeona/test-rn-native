import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

import Checkbox from '#components/common/Checkbox/Checkbox.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import {CustomFlatList} from '#components/common/CustomScrollComponents';
import CText from '#components/common/CustomText/CText.tsx';
import {useChangeWidth} from '#hooks/useGlobal.ts';
import {setStorageItem} from '#utils/storageHelper.ts';

const Onboarding = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const [isChecked, setIsChecked] = useState(true);
  const invalidWidth = useChangeWidth();
  const flatListData = [
    {key: '1', backgroundColor: '#1abc9c', text: 'Welcome to My App'},
    {key: '2', backgroundColor: '#3498db', text: 'Swipe to Learn More'},
    {key: '3', backgroundColor: '#9b59b6', text: 'Enjoy Using My App'},
  ];

  const renderItem = ({item}: {item: {backgroundColor: string; text: string}}) => (
    <View style={[styles.slide, {backgroundColor: item.backgroundColor, width: invalidWidth}]}>
      <CText style={styles.text} text={item.text} />
    </View>
  );

  const onChangeCheckbox = (checked: boolean) => {
    setIsChecked(checked);
  };

  const onPressComplete = () => {
    setStorageItem('isVisitor', isChecked);
    navigation.navigate('SignIn');
  };

  return (
    <CSafeAreaView edges={['top', 'bottom']}>
      <CView>
        <CText style={{alignSelf: 'center'}} text={`체크히어에 오신것을 환영합니다!`} />
        <CustomFlatList
          data={flatListData}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.key}
        />
        <Checkbox
          isChecked={isChecked}
          onValueChangeHandler={onChangeCheckbox}
          labelMessage={`다시 보지 않기`}
        />
        <CButton text={`완료!`} onPress={onPressComplete} />
      </CView>
    </CSafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Onboarding;
