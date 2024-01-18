import React from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

const LectureDetail = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  // const dayScheduleData = useRecoilValue(scheduleState.dayScheduleState);
  const lectureData = {
    lectureId: 1,
    lectureName: 'Java 테스트',
    lectureAllowMinus: 5,
    lectureAllowPlus: 5,
    lectureAllowLatePlus: 0,
    lectureCheckInterval: 60,
  };

  const onPressHistory = () => {
    navigation.navigate('ScheduleHistory');
  };

  return (
    <SafeAreaView style={styles.conatainer}>
      <View style={[styles.flexRow, {borderTopWidth: 1}]}>
        <Text style={styles.tableHeader}>강의명</Text>
        <Text style={styles.tableData}>{lectureData.lectureName}</Text>
      </View>
      <View style={styles.flexRow}>
        <Text style={styles.tableHeader}>수강기간</Text>
        <Text style={styles.tableData}>~~</Text>
      </View>
      <Pressable onPress={onPressHistory}>
        <Text>내 출석 기록 보기</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  conatainer: {
    margin: 10,
  },
  flexRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  tableHeader: {
    width: '20%',
    padding: 10,
    backgroundColor: 'grey',
  },
  tableData: {
    flexGrow: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LectureDetail;
