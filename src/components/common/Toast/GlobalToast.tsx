import React, {useEffect, useState} from 'react';
import {Animated} from 'react-native';

import {useRecoilState} from 'recoil';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';
import GlobalState from '#recoil/Global';

const GlobalToast = () => {
  const [toastState, setToastState] = useRecoilState(
    GlobalState.globalToastState,
  );
  const {isVisible, message, content, time} = toastState;
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // 모달이 나타난 후 3초 후에 자동으로 사라지도록 설정
      const timer = setTimeout(() => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setToastState({isVisible: false, message: ''}));
      }, time ?? 3000);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const modalTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  return (
    <>
      {isVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 70,
            width: '80%',
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.dark.gray,
            opacity: isVisible ? 1 : 0,
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 20,
            transform: [{translateY: modalTranslateY}],
          }}>
          <CText
            style={{textAlign: 'center'}}
            text={message ?? ''}
            lineBreak
            lineHeight={24}
            fontWeight="700"
            color="white"
          />
          {content}
        </Animated.View>
      )}
    </>
  );
};

export default GlobalToast;
