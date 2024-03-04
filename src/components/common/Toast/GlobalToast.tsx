import React, {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';
import globalState from '#recoil/Global';
import {Animated} from 'react-native';
import CText from '#components/common/CustomText/CText.tsx';

const GlobalToast = () => {
  const [toastState, setToastState] = useRecoilState(
    globalState.globalToastState,
  );
  const {isVisible, message} = toastState;
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
      }, 3000);

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
            top: 20,
            width: '80%',
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            padding: 20,
            borderRadius: 7,
            transform: [{translateY: modalTranslateY}],
          }}>
          <CText text={message} color={'white'} />
        </Animated.View>
      )}
    </>
  );
};

export default GlobalToast;
