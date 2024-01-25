import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface checkProps {
  size: number;
  color: string;
  isCircle?: boolean;
}
const CheckIcon = (props: checkProps) => {
  const {size, color, isCircle} = props;
  return (
    <View
      style={[
        isCircle && styles.isCircle,
        {
          width: size,
          height: size,
          backgroundColor: color,
        },
      ]}>
      <Text>V</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  check: {
    borderRadius: 2,
    alignItems: 'center',
  },
  isCircle: {
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default CheckIcon;
