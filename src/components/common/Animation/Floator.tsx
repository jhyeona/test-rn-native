import React, {ReactNode, useRef} from 'react';
import {Animated, View, StyleSheet, PanResponder} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';

const DraggableFAB = ({children}: {children: ReactNode}) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const {dx, dy} = gestureState;
        return Math.abs(dx) > 5 || Math.abs(dy) > 5; // 움직임이 5 이상일 때 true
      },
      onPanResponderGrant: () => {
        const {x, y} = (pan as any).__getValue();
        pan.setOffset({x, y});
        pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  // 원래 위치로 복귀
  useFocusEffect(
    React.useCallback(() => {
      Animated.timing(pan, {
        toValue: {x: 0, y: 0},
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [pan]),
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{translateX: pan.x}, {translateY: pan.y}],
        }}
        {...panResponder.panHandlers}>
        <View style={styles.childrenWrapper}>{children}</View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  childrenWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DraggableFAB;
