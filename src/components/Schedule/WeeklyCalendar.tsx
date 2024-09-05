import React, {useState, useCallback, useRef, useMemo, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  ListRenderItem,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import moment from 'moment';
import {useRecoilState} from 'recoil';

import NoData from '#components/common/NoData';
import WeeklyCalendarItem from '#components/Schedule/WeeklyCalendarItem.tsx';
import {COLORS} from '#constants/colors.ts';
import {
  CalendarItem,
  generateWeekDates,
} from '#containers/DailySchedules/utils/dateHelper.ts';
import {useChangeWidth} from '#hooks/useGlobal.ts';
import scheduleState from '#recoil/Schedule';

const WeeklyCalendar: React.FC = () => {
  // 날짜 한 칸당 width 설정
  const screenWidth = useChangeWidth();
  const itemWidth = screenWidth / 7;

  // 현재 날짜 기준 월요일을 초기 날짜로 설정
  const startOfWeek = moment()
    .startOf('week')
    .subtract(1, 'weeks')
    .add(1, 'day');
  const initialDates = useMemo(
    () => generateWeekDates(startOfWeek, 14),
    [startOfWeek],
  );

  const [{isWeekly, date: daily}, setSelectedDate] = useRecoilState(
    scheduleState.selectedCalendarDate,
  );
  const flatListRef = useRef<FlatList<CalendarItem>>(null);
  const [dates, setDates] = useState<CalendarItem[]>([]);
  const [lastPrependTime, setLastPrependTime] = useState(0);

  // 왼쪽 스크롤 (이전 날짜) - 중복 호출 방지를 위해 0.3초 제한
  const prependDates = useCallback(() => {
    const now = Date.now();
    if (now - lastPrependTime < 300) return;
    setLastPrependTime(now);

    const firstDate = dates[0].date;
    const newDates = generateWeekDates(firstDate.clone().subtract(7, 'day'), 7);
    setDates(prevDates => [...newDates, ...prevDates]);

    // 원래 데이터에서 미리보기용 데이터(이전 주)를 추가했기 때문에 실제 보여줘야하는 미리보기용 다음의 데이터인 다음 페이지로 이동하도록 처리
    flatListRef.current?.scrollToOffset({
      offset: screenWidth,
      animated: false,
    });
  }, [dates, screenWidth, lastPrependTime]);

  // 오른쪽 스크롤 (이후 날짜)
  const appendDates = useCallback(() => {
    const lastDate = dates[dates.length - 1].date;
    const newDates = generateWeekDates(lastDate.clone().add(1, 'day'), 7);
    setDates(prevDates => [...prevDates, ...newDates]);
  }, [dates]);

  // 스크롤 이벤트 핸들러
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {contentOffset, contentSize} = event.nativeEvent;
    if (!contentOffset || !contentSize) return;

    const offsetX = contentOffset.x;
    const contentWidth = contentSize.width;

    if (offsetX <= 0) {
      prependDates(); // 제일 앞까지 도달한 경우 이전 날짜(미리보기 용) 생성
    }
    if (offsetX + screenWidth >= contentWidth - itemWidth) {
      appendDates(); // 이후 날짜 생성
    }
  };

  // 날짜 클릭 시 선택된 날짜 업데이트
  const onPressDate = useCallback(
    ({item}: {item: CalendarItem}) => {
      setSelectedDate(prev => ({...prev, date: item.date}));
    },
    [setSelectedDate],
  );

  // 아이템 렌더링
  const renderItem: ListRenderItem<CalendarItem> = ({item}) => (
    <WeeklyCalendarItem
      item={item}
      itemWidth={itemWidth}
      onPressDate={onPressDate}
    />
  );

  // 특정 날짜로 스크롤 이동
  const scrollToDate = (date: moment.Moment) => {
    const index = dates.findIndex(dateItem =>
      dateItem.date.isSame(date, 'day'),
    );
    if (index >= 0) {
      flatListRef.current?.scrollToIndex({index, animated: true});
    }
  };

  useEffect(() => {
    // 오늘 버튼 클릭 시 오늘 날짜가 포함된 이번 주로 이동
    if (daily.isSame(moment(), 'day')) {
      const startOfWeekToday = moment().startOf('week').add(1, 'day');
      scrollToDate(startOfWeekToday);
    }
  }, [daily]);

  useEffect(() => {
    // 일간/주간 일정 화면 이동 시 초기화
    setDates(initialDates);
    setSelectedDate(prev => ({...prev, date: moment()}));
  }, [isWeekly]);

  return (
    <FlatList
      style={{marginBottom: 10}}
      ref={flatListRef}
      horizontal
      pagingEnabled
      removeClippedSubviews
      keyExtractor={item => item.key}
      data={dates}
      renderItem={renderItem}
      ListEmptyComponent={<NoData />}
      initialNumToRender={7}
      maxToRenderPerBatch={7}
      windowSize={7}
      initialScrollIndex={7}
      onScroll={handleScroll}
      scrollEventThrottle={32}
      snapToInterval={screenWidth}
      showsHorizontalScrollIndicator={false}
      getItemLayout={(_, index) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      })}
      decelerationRate="fast"
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingVertical: 7,
    borderRadius: 7,
    gap: 5,
  },
  selectedContainer: {
    backgroundColor: COLORS.primary,
  },
  date: {
    textAlign: 'center',
  },
});

export default WeeklyCalendar;
