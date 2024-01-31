import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import CView from '../../components/common/CommonView/CView.tsx';
import {RouteProp} from '@react-navigation/core/src/types.tsx';
import {NavigationState} from '@react-navigation/routers';
import {NavigatorScreenParams, useRoute} from '@react-navigation/native';
import {getLectureInfo} from '../../hooks/useSchedule.ts';
import {ScheduleHistoryDataProps} from '../../types/schedule.ts';
import {COLORS} from '../../constants/colors.ts';
import CText from '../../components/common/CustomText/CText.tsx';
import moment from 'moment';
import Header from '../../components/common/Header/Header.tsx';

interface Props {
  navigation: BottomTabNavigationHelpers;
}
type RootTabParamList = {
  LectureDetail: {attendeeId: number; scheduleId: number};
};

const LectureDetail = (props: Props) => {
  const {navigation} = props;
  const route = useRoute<RouteProp<RootTabParamList, 'LectureDetail'>>();
  const {attendeeId, scheduleId} = route.params;
  const [lectureData, setLectureData] = useState<
    ScheduleHistoryDataProps | undefined
  >(undefined);

  // const onPressHistory = () => {
  //   navigation.navigate('ScheduleHistory');
  // };
  const setData = async () => {
    const data = await getLectureInfo({
      attendeeId: attendeeId,
      scheduleId: scheduleId,
    });
    setLectureData(data);
  };

  useEffect(() => {
    setData().then();
  }, []);

  return (
    <CSafeAreaView>
      <Header title="강의 상세" isBack navigation={navigation} />
      <CView>
        <View style={styles.table}>
          <View
            style={[
              styles.row,
              {borderBottomWidth: 1, borderColor: COLORS.layout},
            ]}>
            <View style={[styles.cell, styles.title]}>
              <CText text="강의명" fontWeight="600" />
            </View>
            <View style={[styles.cell, styles.body]}>
              <CText text={lectureData?.lecture.lectureName ?? ''} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.cell, styles.title]}>
              <CText text="수강기간" fontWeight="600" />
            </View>
            <View style={[styles.cell, styles.body]}>
              <CText
                text={`${moment(lectureData?.lecture.lectureStartDate).format(
                  'YYYY.MM.DD',
                )} ~ ${moment(lectureData?.lecture.lectureEndDate).format(
                  'YYYY.MM.DD',
                )}`}
              />
            </View>
          </View>
        </View>
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  table: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: COLORS.layout,
    borderRadius: 7,
    height: 128,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: 116,
    backgroundColor: COLORS.light.gray,
  },
  body: {
    flex: 1,
  },
});

export default LectureDetail;
