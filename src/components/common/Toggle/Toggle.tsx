import {useRef, useEffect} from 'react';
import {Pressable, StyleSheet, Animated} from 'react-native';

import {COLORS} from '#constants/colors.ts';

interface Props {
  isActive: boolean;
  disabled?: boolean;
  onToggle: (value: boolean) => void;
}

const Toggle = (props: Props) => {
  const {isActive, disabled, onToggle} = props;
  const toggleAnimation = useRef(new Animated.Value(0)).current;

  const handleToggle = () => {
    onToggle(!isActive);
  };

  const backgroundStyle = isActive ? styles.activeBackground : styles.background;

  const circlePosition = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26],
  });

  useEffect(() => {
    Animated.timing(toggleAnimation, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive, toggleAnimation]);

  return (
    <Pressable
      disabled={disabled}
      onPress={handleToggle}
      style={[styles.container, backgroundStyle]}>
      <Animated.View style={[styles.circle, {left: circlePosition}]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 57,
    height: 33,
    borderRadius: 16.5,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    borderWidth: 1,
    borderColor: COLORS.layout,
    backgroundColor: COLORS.layout,
  },
  activeBackground: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  circle: {
    width: 27,
    height: 27,
    borderRadius: 14.5,
    backgroundColor: 'white',
  },
});

export default Toggle;
