import React, {useRef, useState} from 'react';
import {Pressable, Animated, ViewStyle} from 'react-native';

interface RotatingContainerProps {
  onPress?: (isRotated: boolean) => void;
  children: React.ReactNode; // 자식 요소로 받을 수 있게 설정
  duration?: number;
  style?: ViewStyle; // 외부 스타일 적용을 위한 props
}

const RotatingContainer = ({
  onPress,
  children,
  duration,
  style,
}: RotatingContainerProps) => {
  const [isRotated, setIsRotated] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current; // 회전 상태 관리

  const handlePress = () => {
    onPress && onPress(isRotated);
    Animated.timing(rotateAnim, {
      toValue: isRotated ? 0 : 1, // 180도 회전
      duration: duration ?? 500,
      useNativeDriver: true,
    }).start();
    setIsRotated(!isRotated);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[{transform: [{rotate: rotation}]}, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default RotatingContainer;
