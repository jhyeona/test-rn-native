import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Animated, Text, Pressable} from 'react-native';
import {COLORS} from '../../../constants/colors';

interface Props {
  onToggle: (value: boolean) => void;
}
const TextToggle = (props: Props) => {
  const {onToggle} = props;
  const [isActive, setIsActive] = useState(false);
  const toggleAnimation = useRef(new Animated.Value(0)).current;

  const handleToggle = () => {
    setIsActive(!isActive);
    onToggle(!isActive);
  };

  useEffect(() => {
    Animated.timing(toggleAnimation, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive, toggleAnimation]);

  const circlePosition = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 43], // Adjust this value to control the smoothness of the animation
  });

  return (
    <Pressable
      onPress={handleToggle}
      style={[
        styles.container,
        isActive ? styles.activeBackground : styles.background,
      ]}>
      <Animated.View style={[styles.circle, {left: circlePosition}]} />
      <View
        style={isActive ? styles.activeTextContainer : styles.textContainer}>
        <Text style={{color: 'white'}}>{isActive ? '주간' : '오늘'}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 67,
    height: 24,
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
    width: 20,
    height: 20,
    borderRadius: 13.5,
    backgroundColor: 'white',
  },
  textContainer: {
    position: 'absolute',
    left: 18,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTextContainer: {
    position: 'absolute',
    left: 0,
    right: 18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
});

export default TextToggle;
