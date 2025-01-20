import {useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus, FlatList} from 'react-native';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import {CustomFlatList} from '#components/common/CustomScrollComponents';
import Header from '#components/common/Header/Header.tsx';
import CKeyboardAvoidingView from '#components/common/Keyboard/CKeyboardAvoidingView.tsx';
import ProgressStatusNumber from '#containers/SignUp/components/ProgressStatusNumber.tsx';
import {useReqSMSConfirm} from '#containers/SignUp/hooks/useApi.ts';
import {getInitialSignUpData, renderItem} from '#containers/SignUp/utils/signupHelper.tsx';
import {sentryCaptureException} from '#services/sentry.ts';
import {PageData, SignUpDataProps} from '#types/signup.ts';

const SignUp = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const [signUpData, setSignUpData] = useState<SignUpDataProps>(getInitialSignUpData());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);

  const {smsConfirm} = useReqSMSConfirm();

  const flatListData: PageData[] = [
    {
      index: 0,
      id: 'SignUpUserData',
      props: {signUpData, setSignUpData},
    },
    {
      index: 1,
      id: 'SignUpUserPhone',
      props: {signUpData},
    },
    {
      index: 2,
      id: 'SignUpUserPassword',
      props: {signUpData, setSignUpData, navigation},
    },
  ];

  // FlatList 의 현재 인덱스
  const onViewableItemsChanged = ({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      const firstVisibleItem = viewableItems[0];
      setCurrentIndex(firstVisibleItem.index);
    }
  };

  // 앱 상태 (+리스너)
  const handleAppStateChange = async (state: AppStateStatus) => {
    const {phone, code} = signUpData;
    if (!code) return;

    // SMS 보내고나서 돌아왔을 때 실행
    if (state === 'active') {
      const payload = {phone, code};
      try {
        await smsConfirm(payload);
        flatListRef.current?.scrollToIndex({index: 2, animated: true}); // SMS 발송확인 완료되면 비밀번호 입력페이지로 이동
      } catch (error) {
        sentryCaptureException({error, payload, eventName: 'requestSignUpSmsConfirm'});
      }
    }
  };

  useEffect(() => {
    if (currentIndex === 0 && signUpData.code) {
      // 정보 입력 페이지에서 인증코드가 발급되면 다음 페이지로 이동
      flatListRef.current?.scrollToIndex({index: 1, animated: true});
    }
    // 앱 상태 리스너 등록
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [signUpData.code]);

  return (
    <CSafeAreaView>
      <Header title="회원가입" navigation={navigation} isBack />
      <CView>
        <CKeyboardAvoidingView>
          <ProgressStatusNumber currentNumber={currentIndex + 1} lastNumber={3} />
          <CustomFlatList
            ref={flatListRef}
            data={flatListData}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{itemVisiblePercentThreshold: 50}}
          />
        </CKeyboardAvoidingView>
      </CView>
    </CSafeAreaView>
  );
};

export default SignUp;
