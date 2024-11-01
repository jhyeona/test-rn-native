import React, {useEffect, useState} from 'react';
import {FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import moment from 'moment/moment';
import {useRecoilValue} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Dropdown, {ItemProps} from '#components/common/Dropdown/Dropdown.tsx';
import NoData from '#components/common/NoData';
import StatusInfoContainer from '#components/common/StatusInfoContainer';
import {COLORS} from '#constants/colors.ts';
import {REASON_STATUS_MAP} from '#constants/reason.ts';
import {useGetLectureList} from '#containers/DailySchedules/hooks/useApi.ts';
import {NavigateReasonProps} from '#containers/ReasonStatement';
import ListHeader from '#containers/ReasonStatement/components/ReasonTableHeader.tsx';
import {useGetReasonList} from '#containers/ReasonStatement/hooks/useApi.ts';
import {reasonListTableStyles} from '#containers/ReasonStatement/styles';
import GlobalState from '#recoil/Global';
import {ReqGetReasonList, ResGetReasonDetails} from '#types/reason.ts';

const PAGE_SIZE = 25;

const ReasonTable = ({handleNavigate}: {handleNavigate: (param: NavigateReasonProps) => void}) => {
  const selectedAcademy = useRecoilValue(GlobalState.selectedAcademy);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ResGetReasonDetails[]>([]);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [payload, setPayload] = useState<ReqGetReasonList>({
    academyId: selectedAcademy,
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const {reasonList, refetchReasonList} = useGetReasonList(payload);
  const {lectureItems, refetchLectureList} = useGetLectureList();

  // 강의 변경
  const changedLecture = (item: ItemProps) => {
    setData([]); // 데이터 초기화
    setPayload(prev => ({...prev, page: 1, lectureId: item.id})); // 강의 변경 시 페이지 초기화
  };

  // 데이터 추가
  const handleLoadMore = () => {
    if (hasMoreData && data.length === payload.page * PAGE_SIZE) {
      setPayload(prev => ({...prev, page: prev.page + 1}));
    }
  };

  // 상세보기 (수정) 이동
  const handleDetail = (reasonId: string) => {
    setPayload(prev => ({...prev, page: 1})); // 초기화하기 위함
    handleNavigate({isCreate: false, reasonId});
  };

  // 사유서 작성 이동
  const handleCreate = () => {
    setPayload(prev => ({...prev, page: 1})); // 초기화하기 위함
    handleNavigate({isCreate: true});
  };

  // 당겨서 새로고침
  const onRefresh = () => {
    setIsLoading(true);
    setTimeout(async () => {
      await Promise.all([refetchLectureList(), refetchReasonList()]);
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    if (reasonList?.content) {
      if (payload.page === 1) {
        setData(reasonList.content);
      } else {
        setData(prev => [...prev, ...reasonList.content]);
      }
      // 더 이상 데이터가 없으면 hasMoreData 를 false 로 설정
      setHasMoreData(reasonList.content.length === PAGE_SIZE);
    }
  }, [reasonList]);

  useEffect(() => {
    // 강의 리스트 옵션에 전체 추가
    const updatedData = [{id: '', label: '전체'}, ...lectureItems];
    setItems(updatedData);
  }, [lectureItems]);

  // 사유서 리스트 아이템
  const renderItem: ListRenderItem<ResGetReasonDetails> = ({item, index}) => {
    const status = REASON_STATUS_MAP[item.status];
    return (
      <TouchableOpacity
        key={`reason-item-${index}`}
        style={reasonListTableStyles.row}
        onPress={() => handleDetail(item.reasonId)}>
        <View style={reasonListTableStyles.row1}>
          <Text numberOfLines={2} ellipsizeMode="tail" lineBreakStrategyIOS="hangul-word">
            {item.lectureName}
          </Text>
          <CText
            color={COLORS.placeholder}
            text={moment(item.date).format('YY.MM.DD')}
            fontSize={12}
          />
        </View>
        <View style={reasonListTableStyles.row2}>
          <Text numberOfLines={2} ellipsizeMode="tail" lineBreakStrategyIOS="hangul-word">
            {item.content}
          </Text>
        </View>
        <View style={reasonListTableStyles.row3}>
          <StatusInfoContainer colorType={status.colorType} text={status.text} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Dropdown items={items} onSelect={changedLecture} selected={items[0]} />
      <FlatList
        style={styles.container}
        ListHeaderComponent={<ListHeader />}
        stickyHeaderIndices={[0]}
        data={data}
        renderItem={renderItem}
        refreshing={isLoading}
        onRefresh={onRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        contentContainerStyle={{flex: data.length > 0 ? 0 : 1}}
        ListEmptyComponent={<NoData fullHeight message="📝 작성된 사유서가 없습니다." />}
      />
      <CButton text="사유서 작성하기" onPress={handleCreate} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ReasonTable;
