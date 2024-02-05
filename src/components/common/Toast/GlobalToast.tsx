import React, {useEffect, useRef, useState} from 'react';
import {useRecoilState} from 'recoil';
import globalState from '../../../recoil/Global';
import {Animated, SafeAreaView, StyleSheet, View} from 'react-native';
import CText from '../CustomText/CText.tsx';

const GlobalToast = () => {
  const [toastState, setToastState] = useRecoilState(
    globalState.globalToastState,
  );
  const {isVisible, message} = toastState;
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => setToastState({isVisible: false, message: ''}));
    }, 3000);
  }, [setToastState, slideAnimation]);

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <>
      {isVisible && (
        <SafeAreaView style={styles.toastContainer}>
          <Animated.View
            style={[
              styles.innerBox,
              {
                transform: [
                  {
                    translateY: slideAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 0],
                    }),
                  },
                ],
              },
            ]}>
            <CText text={message} color="white" />
          </Animated.View>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  innerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    padding: 10,
    minHeight: 60,
    borderRadius: 7,
    backgroundColor: 'black',
  },
});

export default GlobalToast;
