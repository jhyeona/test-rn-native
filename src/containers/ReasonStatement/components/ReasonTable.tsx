import {useEffect, useState} from 'react';
import {ListRenderItem, StyleSheet} from 'react-native';

import {useRecoilValue} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import {CustomFlatList} from '#components/common/CustomScrollComponents';
import Dropdown, {ItemProps} from '#components/common/Dropdown/Dropdown.tsx';
import NoData from '#components/common/NoData';
import {useGetLectureList} from '#containers/DailySchedules/hooks/useApi.ts';
import {NavigateReasonProps} from '#containers/ReasonStatement';
import ListHeader from '#containers/ReasonStatement/components/ReasonTableHeader.tsx';
import ReasonTableItem from '#containers/ReasonStatement/components/ReasonTableItem.tsx';
import {useGetReasonList} from '#containers/ReasonStatement/hooks/useApi.ts';
import GlobalState from '#recoil/Global';
import {ReqGetReasonList, ResGetReasonDetails} from '#types/reason.ts';

const PAGE_SIZE = 25;

const ReasonTable = ({handleNavigate}: {handleNavigate: (param: NavigateReasonProps) => void}) => {
  const selectedAcademy = useRecoilValue(GlobalState.selectedAcademy);

  const [items, setItems] = useState<ItemProps[]>([]);
  const [payload, setPayload] = useState<ReqGetReasonList>({
    academyId: selectedAcademy,
    pageSize: PAGE_SIZE,
  });

  const {lectureItems, refetchLectureList, isLoading: isLectureLoading} = useGetLectureList();
  const {reasonList, refetchReasonList, hasNextPage, fetchNextPage, isReasonLoading} =
    useGetReasonList(payload);

  // 무한 스크롤 - 다음 데이터
  const loadNextPage = async () => {
    if (hasNextPage) {
      await fetchNextPage();
    }
  };

  // 새로고침
  const onRefresh = async () => {
    await Promise.all([refetchLectureList(), refetchReasonList()]);
  };

  // 강의 변경
  const changedLecture = (item: ItemProps) => {
    setPayload(prev => ({...prev, lectureId: item.id}));
  };

  // 사유서 작성 / 상세보기 이동 (reasonId 있으면 상세보기)
  const handleMovePage = async (reasonId?: string) => {
    await onRefresh();
    handleNavigate({isCreate: !reasonId, reasonId});
  };

  // 사유서 리스트 아이템
  const renderItem: ListRenderItem<ResGetReasonDetails> = ({item, index}) => {
    return <ReasonTableItem item={item} index={index} handleMovePage={handleMovePage} />;
  };

  useEffect(() => {
    // 강의 리스트 옵션에 전체 추가
    const updatedData = [{id: '', label: '전체'}, ...lectureItems];
    setItems(updatedData);
  }, [lectureItems]);

  return (
    <>
      <Dropdown items={items} onSelect={changedLecture} selected={items[0]} />
      <CustomFlatList
        style={styles.container}
        ListHeaderComponent={<ListHeader />}
        stickyHeaderIndices={[0]}
        data={reasonList}
        renderItem={renderItem}
        refreshing={isReasonLoading && isLectureLoading}
        onRefresh={onRefresh}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{flex: reasonList.length ? 0 : 1}}
        ListEmptyComponent={<NoData fullHeight message="📝 작성된 사유서가 없습니다." />}
      />
      <CButton text="사유서 작성하기" onPress={handleMovePage} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ReasonTable;
