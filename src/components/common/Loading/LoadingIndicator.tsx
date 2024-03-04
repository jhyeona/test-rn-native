import React from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {useRecoilValue} from 'recoil';
import globalState from '#recoil/Global';
import {COLORS} from '#constants/colors.ts';

const LoadingIndicator = () => {
  const isLoading = useRecoilValue(globalState.globalLoadingState);
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <>
      {isLoading && (
        <View style={styles.container}>
          <Animated.View
            style={[styles.spinner, {transform: [{rotate: spin}]}]}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: COLORS.primary,
    borderTopColor: 'transparent',
  },
});

export default LoadingIndicator;
