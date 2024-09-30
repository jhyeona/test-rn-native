import React from 'react';
import {View} from 'react-native';

import * as Icons from '#assets/svg';
import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';

type IconKeys = keyof typeof Icons;

interface RouteDataProps {
  [key: string]: {
    icon: IconKeys;
    label: string;
  };
}
interface TabBarProps {
  routeName: string;
  focused: boolean;
}

const TabBar = (props: TabBarProps) => {
  const {routeName, focused} = props;

  const routeData: RouteDataProps = {
    scheduleHistory: {icon: 'm_Finder', label: '출석 기록'},
    dailySchedules: {icon: 'm_Daily', label: '일간 일정'},
    weeklySchedules: {icon: 'm_Weekly', label: '주간 일정'},
    settings: {icon: 'm_Setting', label: '설정'},
  };
  const {icon, label} = routeData[routeName];
  return (
    <View style={{alignItems: 'center'}}>
      <SvgIcon
        name={icon}
        size={20}
        color={focused ? 'black' : COLORS.placeholder}
        stroke={focused ? 'black' : COLORS.placeholder}
      />
      <CText
        text={label}
        fontSize={13}
        color={focused ? 'black' : COLORS.placeholder}
        style={{paddingTop: 7}}
      />
    </View>
  );
};

export default TabBar;
