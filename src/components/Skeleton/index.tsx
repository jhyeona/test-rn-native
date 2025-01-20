import {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import {COLORS} from '#constants/colors.ts';

const Skeleton = ({style, borderRadius}: {style?: StyleProp<ViewStyle>; borderRadius?: number}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnimation = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => loopAnimation());
    };

    loopAnimation();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f6f6f6', '#ececec'],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        style ?? {width: '100%', height: '100%'},
        {
          borderRadius: borderRadius || 7,
          backgroundColor,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    marginVertical: 4,
  },
});

export default Skeleton;
