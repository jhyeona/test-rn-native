import {View} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';

const timeProps = {
  fontWeight: '600',
};

const DaySchedulesTime = ({style}: {style?: StyleProp<ViewStyle>}) => {
  return (
    <View style={style}>
      <CText {...timeProps} text="10:00" />
      <CText {...timeProps} text="~" />
      <CText {...timeProps} text="12:00" />
      <SvgIcon name="ScheduleTimeLIne" style={{marginTop: 10}} />
    </View>
  );
};

export default DaySchedulesTime;
