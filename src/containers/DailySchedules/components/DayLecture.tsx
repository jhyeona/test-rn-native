import {View} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import CText from '#components/common/CustomText/CText.tsx';
import BtnSchedule from '#containers/DailySchedules/components/BtnSchedule.tsx';
import ScheduleTimeInfo from '#containers/DailySchedules/components/ScheduleTimeInfo.tsx';

const DayLecture = ({style}: {style?: StyleProp<ViewStyle>}) => {
  return (
    <View
      style={[
        style,
        {gap: 7, borderRadius: 7, backgroundColor: 'white', padding: 10},
      ]}>
      <CText text="강의명" fontSize={20} />
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <ScheduleTimeInfo />
        <BtnSchedule />
      </View>
    </View>
  );
};

export default DayLecture;
