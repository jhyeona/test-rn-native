// TimeLabel.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface TimeLabelProps {
  time: string;
}

const TimeLabel: React.FC<TimeLabelProps> = ({time}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
  },
  timeText: {
    fontSize: 12,
  },
});

export default TimeLabel;
