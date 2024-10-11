import {StyleSheet, View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {RouteProp} from '@react-navigation/core/src/types.tsx';
import {useRoute} from '@react-navigation/native';
import moment from 'moment';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import {COLORS} from '#constants/colors.ts';
import {useGetLectureInfo} from '#containers/LectureDetail/hooks/useApi.ts';

interface Props {
  navigation: BottomTabNavigationHelpers;
}
type RootTabParamList = {
  LectureDetail: {attendeeId: string; scheduleId: string};
};

const LectureDetail = (props: Props) => {
  const {navigation} = props;
  const route = useRoute<RouteProp<RootTabParamList, 'LectureDetail'>>();
  const {attendeeId, scheduleId} = route.params;

  const {lectureInfo} = useGetLectureInfo({
    attendeeId: attendeeId,
    scheduleId: scheduleId,
  });

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
              <CText text={lectureInfo?.lecture.lectureName ?? ''} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.cell, styles.title]}>
              <CText text="수강기간" fontWeight="600" />
            </View>
            <View style={[styles.cell, styles.body]}>
              <CText
                text={`${moment(lectureInfo?.lecture.lectureStartDate).format(
                  'YYYY.MM.DD',
                )} ~ ${moment(lectureInfo?.lecture.lectureEndDate).format(
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
