import React from 'react';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import * as Icons from '#assets/svg';
import {View} from 'react-native';
import {Close} from '#assets/svg';
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

  // TODO: 출석기록, 과정의 아이콘 추가
  const routeData: RouteDataProps = {
    Schedule: {icon: 'Home', label: '일정'},
    ScheduleHistory: {icon: 'Pencil', label: '출석기록'},
    Lecture: {icon: 'Pencil', label: '과정'},
    Mypage: {icon: 'Setting', label: '설정'},
  };
  const {icon, label} = routeData[routeName];

  return (
    <View style={{alignItems: 'center'}}>
      <SvgIcon name={icon} size={icon === 'Home' ? 16 : 20} />
      <CText
        text={label}
        fontSize={11}
        color={focused ? 'black' : COLORS.placeholder}
        style={{paddingTop: 4}}
      />
    </View>
  );
};

export default TabBar;
