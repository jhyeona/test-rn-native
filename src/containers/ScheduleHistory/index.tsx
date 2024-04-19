import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import moment from 'moment';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {EventProps, SchedulePeriodDataProps} from '#types/schedule.ts';
import {getEventHistory} from '#hooks/useSchedule.ts';
import globalState from '#recoil/Global';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import Header from '#components/common/Header/Header.tsx';
import {COLORS} from '#constants/colors.ts';
import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import DateSelector from '#components/common/Calendar/DateSelector.tsx';
import CView from '#components/common/CommonView/CView';

const ScheduleHistory = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const selectedAcademy = useRecoilValue(globalState.selectedAcademy);
  const selectDayDate = useRecoilValue(globalState.selectDayScheduleDate);
  const setModalState = useSetRecoilState(globalState.globalModalState);
  const [historyData, setHistoryData] = useState<SchedulePeriodDataProps>();
  const [startDate, setStartDate] = useState(moment(selectDayDate));
  const [endDate, setEndDate] = useState(moment(selectDayDate));
  const [selectedIsStart, setSelectedIsStart] = useState(true);
  const [selectedDate, setSelectedDate] = useState(endDate);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = (isStart: boolean) => {
    setSelectedIsStart(isStart);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(moment(date));
    hideDatePicker();
  };

  const getData = async () => {
    const data = await getEventHistory({
      academyId: selectedAcademy,
      startDate: startDate.format('YYYYMMDD'),
      endDate: endDate.format('YYYYMMDD'),
    });
    setHistoryData(data);
  };

  const eventStatus = (eventList: Array<EventProps>) => {
    const entered = eventList.filter(val => {
      // 입실 내역
      return val.eventType === 'ENTER';
    });
    const completed = eventList.filter(val => {
      // 퇴실 내역
      return val.eventType === 'COMPLETE';
    });
    const statusType = // 입실 시 상태 (출석 / 지각 / 미출석)
      entered.length > 0 ? eventStatusType(entered[0].status) : '미출석';
    const enteredTime = // 입실 상태가 있다면 입실 시간
      entered.length > 0
        ? `${moment(entered[0].eventTime).format('MM.DD')}\n${moment(
            entered[0].eventTime,
          ).format('HH : mm')}`
        : '-';
    const completedTime = // 퇴실 상태가 있다면 퇴실 시간
      completed.length > 0
        ? `${moment(completed[0].eventTime).format('MM.DD')}\n${moment(
            entered[0].eventTime,
          ).format('HH : mm')}`
        : '-';

    return {statusType, enteredTime, completedTime};
  };

  const eventStatusType = (status: 'NORMAL' | 'LATE' | 'EARLY') => {
    const statusValue = {
      NORMAL: '출석',
      EARLY: '출석',
      LATE: '지각',
    };
    return statusValue[status];
  };

  const onPressDateRefresh = () => {
    // 날짜 선택 초기화
    setStartDate(moment());
    setEndDate(moment());
  };

  useEffect(() => {
    getData().then();
  }, [startDate, endDate]);

  useEffect(() => {
    if (selectedIsStart && moment(selectedDate).isAfter(endDate, 'date')) {
      setStartDate(endDate);
      setModalState({
        isVisible: true,
        title: '안내',
        message: '종료 날짜보다 이전으로 선택하세요.',
      });
      return;
    }
    if (!selectedIsStart && moment(selectedDate).isBefore(startDate, 'date')) {
      setEndDate(startDate);
      setModalState({
        isVisible: true,
        title: '안내',
        message: '시작 날짜보다 이후로 선택하세요.',
      });
      return;
    }
    selectedIsStart
      ? setStartDate(moment(selectedDate))
      : setEndDate(moment(selectedDate));
  }, [selectedDate]);

  return (
    <CSafeAreaView edges={['top', 'bottom']}>
      <Header title="내 출석 기록" navigation={navigation} isBack />
      <CView>
        <View style={{flexDirection: 'row', marginBottom: 30, height: 42}}>
          <DateSelector
            onPressCalendar={() => showDatePicker(true)}
            selectedDate={startDate.format('YYYY-MM-DD')}
          />
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <CText
              style={{
                marginHorizontal: 6,
              }}
              text=" ~ "
              fontSize={20}
              fontWeight="500"
            />
          </View>
          <DateSelector
            onPressCalendar={() => showDatePicker(false)}
            selectedDate={endDate.format('YYYY-MM-DD')}
          />
          <Pressable
            onPress={onPressDateRefresh}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 10,
            }}>
            <SvgIcon name="Refresh" size={25} />
          </Pressable>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={
            selectedIsStart
              ? new Date(startDate.toISOString())
              : new Date(endDate.toISOString())
          }
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          confirmTextIOS="확인"
          cancelTextIOS="취소"
          locale="ko-KR"
        />
        <ScrollView>
          <View style={styles.table}>
            <View style={[styles.row, styles.tableHeader]}>
              <View style={[styles.cell, styles.firstCell]}>
                <CText text="강의명" fontWeight="600" />
              </View>
              <View style={styles.cell}>
                <CText text="구분" fontWeight="600" />
              </View>
              <View style={[styles.cell]}>
                <CText text="입실" fontWeight="600" />
              </View>
              <View style={styles.cell}>
                <CText text="퇴실" fontWeight="600" />
              </View>
            </View>
            {historyData && historyData?.historyList.length > 0 ? (
              historyData?.historyList.map((history, i) => {
                const {statusType, enteredTime, completedTime} = eventStatus(
                  history.eventList,
                );
                return (
                  <View
                    style={[
                      styles.row,
                      i !== history.eventList.length - 1 && styles.borderTop,
                    ]}
                    key={i}>
                    <View style={[styles.cell, styles.firstCell]}>
                      <CText
                        text={history.schedule.lecture.lectureName}
                        style={{textAlign: 'center'}}
                        fontWeight="500"
                        lineBreak
                      />
                    </View>
                    <View style={styles.cell}>
                      {<CText text={statusType} />}
                    </View>
                    <View style={styles.cell}>
                      <CText
                        style={{
                          textAlign: 'center',
                        }}
                        text={enteredTime}
                        lineBreak
                      />
                    </View>
                    <View style={styles.cell}>
                      <CText
                        style={{textAlign: 'center', paddingHorizontal: 5}}
                        text={completedTime}
                        lineBreak
                      />
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={[styles.row, styles.noData]}>
                <CText text="기록이 없습니다." />
              </View>
            )}
          </View>
        </ScrollView>
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  table: {
    flexDirection: 'column',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.layout,
  },
  tableHeader: {
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    backgroundColor: COLORS.lightGray,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstCell: {
    flex: 1.5,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: COLORS.layout,
  },
});

export default ScheduleHistory;
