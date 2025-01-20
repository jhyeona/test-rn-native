import {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet} from 'react-native';

import {COLORS} from '#constants/colors.ts';

interface ProgressBarProps {
  progress: number; // 0 to 1 range, e.g., 0.75 for 75%
}

const ProgressBar = ({progress}: ProgressBarProps) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: progress,
      duration: 500, // duration in milliseconds
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progressBar, {width}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    height: 10,
    width: '100%',
    backgroundColor: COLORS.lineBlue,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
});

export default ProgressBar;
