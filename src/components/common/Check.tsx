import React from 'react';
import {Text, View} from 'react-native';

interface checkProps {
  size: number;
  color: string;
}
const Check = (props: checkProps) => {
  const {size, color} = props;
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: 2,
        alignItems: 'center',
      }}>
      <Text>V</Text>
    </View>
  );
};

export default Check;
