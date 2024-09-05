import {Text, View} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

const DayScheduleTime = ({style}: {style?: StyleProp<ViewStyle>}) => {
  return (
    <View style={style}>
      <Text>10:00</Text>
      <Text>~</Text>
      <Text>12:00</Text>
    </View>
  );
};

export default DayScheduleTime;
