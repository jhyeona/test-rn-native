import {ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const DraggableFAB = ({children}: {children: ReactNode}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const x = event.nativeEvent.translationX;
    const y = event.nativeEvent.translationY;

    // 영역 제한
    if (x >= -60 && x <= 20) {
      translateX.value = x;
    }
    if (y >= -200 && y <= 10) {
      translateY.value = y;
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: withTiming(translateX.value, {duration: 100})},
        {translateY: withTiming(translateY.value, {duration: 100})},
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Animated.View style={[styles.fab, animatedStyle]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default DraggableFAB;
