import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  DevSettings,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Test {
  id: number;
  start: string;
  end: string;
  title: string;
}

const testData: Test[] = [
  {id: 101, start: '10:00', end: '10:40', title: 'CLASS 1'},
  {id: 102, start: '10:00', end: '10:40', title: 'CLASS 1'},
  {id: 103, start: '10:00', end: '10:40', title: 'CLASS 1'},
  {id: 104, start: '10:00', end: '10:40', title: 'CLASS 1'},
  {id: 105, start: '10:00', end: '10:40', title: 'CLASS 1'},
  {id: 201, start: '11:00', end: '11:40', title: 'CLASS 2'},
  {id: 202, start: '11:00', end: '11:40', title: 'CLASS 2'},
  {id: 203, start: '11:00', end: '11:40', title: 'CLASS 2'},
  {id: 204, start: '11:00', end: '11:40', title: 'CLASS 2'},
  {id: 205, start: '11:00', end: '11:40', title: 'CLASS 2'},
  {id: 3, start: '12:00', end: '12:40', title: 'CLASS 3'},
  {id: 4, start: '13:00', end: '13:40', title: 'CLASS 4'},
  {id: 5, start: '14:00', end: '14:40', title: 'CLASS 5'},
  {id: 6, start: '15:00', end: '15:40', title: 'CLASS 6'},
  {id: 7, start: '16:00', end: '16:40', title: 'CLASS 7'},
  {id: 8, start: '17:00', end: '17:40', title: 'CLASS 8'},
  {id: 9, start: '18:00', end: '18:40', title: 'CLASS 9'},
  {id: 10, start: '19:00', end: '19:40', title: 'CLASS 10'},
];

const ITEM_HEIGHT = 100;

const Test2 = () => {
  const [data, setData] = useState<Test[]>(testData);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [visibleItems, setVisibleItems] = useState<Test[]>([]);

  // 새로 고침 핸들러
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // 데이터 로드 시뮬레이션 (2초 후)
    setTimeout(() => {
      // 예시: 데이터를 새로 고침 (기존 데이터에 더미 데이터 추가)
      const refreshedData: Test[] = [
        ...testData,
        ...[
          {id: 4000, title: 'Item 4', start: '00:00', end: '00:00'},
          {id: 5000, title: 'Item 5', start: '00:00', end: '00:00'},
          {id: 6000, title: 'Item 6', start: '00:00', end: '00:00'},
        ],
      ];
      setData(refreshedData);
      setIsRefreshing(false);
    }, 2000);
  }, []);

  const renderItem = ({item}: {item: Test}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    return (
      <View
        style={[styles.itemContainer, {backgroundColor, height: ITEM_HEIGHT}]}>
        <View
          style={{display: 'flex', flexDirection: 'column', borderWidth: 1}}>
          <Text style={{color: '#f0f'}}>{`${item.id}. ${item.title}: `}</Text>
          <Text style={{color: '#f0f'}}>{`${item.start} ~ ${item.end}`}</Text>
        </View>
      </View>
    );
  };

  const loadMoreData = () => {
    if (!loading) return;
    setLoading(true);

    // 예시: 2초 뒤에 더 많은 데이터를 추가합니다.
    setTimeout(() => {
      const moreData: Test[] = [
        {id: 4, start: '13:00', end: '13:40', title: 'TITLE 4'},
        {id: 5, start: '14:00', end: '14:40', title: 'TITLE 5'},
      ];

      setData(prevData => [...prevData, ...moreData]);
      setLoading(false);
    }, 2000);
  };

  const handleViewableItemsChanged = ({
    viewableItems,
    changed,
  }: {
    viewableItems: any[];
    changed: any[];
  }) => {
    setVisibleItems(viewableItems.map(item => item.item)); // 현재 보이는 항목을 상태로 설정
    console.log(
      'Visible items:',
      viewableItems.map(item => item.item.id),
    );
    console.log(
      'Changed items:',
      changed.map(item => item.item.id),
    );
  };

  const getItemLayout = (
    _: ArrayLike<Test> | null | undefined,
    index: number,
  ) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{`My List Header - ${visibleItems?.map(
          item => item.id,
        )}`}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    return loading ? (
      <View style={{padding: 10}}>
        <ActivityIndicator size="large" />
        <Text>Loading more data...</Text>
      </View>
    ) : null;
  };

  return (
    <View style={{height: 700, borderWidth: 1}}>
      <Button
        title={selectedId?.toString() ?? '-'}
        onPress={() => setSelectedId(Math.ceil(Math.random() * 10))}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No Data</Text>} // 데이터가 비어있을 때
        ListFooterComponent={renderFooter} // 데이터의 끝에 도달했을 때 (ex. 로딩 표시 등에 사용)
        onEndReached={loadMoreData} // 리스트 끝에 도달했을 때 실행되는 콜백 함수
        onEndReachedThreshold={0.5} // onEndReached 를 리스트 끝 어느 거리에서 호출할지 (ex. 0.5 설정 시 절반 지점에서 호출)
        ListFooterComponentStyle={{borderWidth: 1, borderColor: 'blue'}}
        ListHeaderComponent={renderHeader} // 고정된 헤더 표시 (ex. 제목, 설명, 검색바, 필터 옵션 등)
        ListHeaderComponentStyle={{
          borderWidth: 1,
          borderColor: 'red',
        }}
        // columnWrapperStyle={styles.row}
        extraData={selectedId} // data 의 변경이 아닌 외부 데이터의 변경으로 인한 리렌더가 필요할 떄
        getItemLayout={getItemLayout} // (*최적화) 항목의 크기를 미리 계산 / flatList 고정된 크기를 가지고 있을 때 유용
        // horizontal // 가로스크롤
        initialNumToRender={3} // (*최적화) 초기 렌더링 시 화면에 보여줄 리스트 항목의 개수
        // initialScrollIndex={3} // (*성능영향) 지정된 인덱스가 처음에 보여짐 / getItemLayout 필수 / 맨위로 스크롤 비활성화
        // inverted // header 부터 역순으로 표시 / 채팅이나 시간순 인터페이스에서 사용
        keyExtractor={item => item.id.toString()} // item key 값
        // numColumns={5} // 열로 나누어 표시 / 그리드 형식 정렬 가능 / horizontal false 일 때만 사용 가능 / flex: 1 로 너비 사용하면 됨
        onRefresh={handleRefresh} // 당겨서 새로고침 (refreshing 과 함께 사용)
        onViewableItemsChanged={handleViewableItemsChanged} // 화면 표시항목 변경될 때 호출되는 콜백 함수 (가시성추적, 최적화, 상태 업데이트 등)
        progressViewOffset={250} // 새로고침 시 로딩 스피너 위치
        refreshing={isRefreshing} // 새로고침 상태
        removeClippedSubviews // (*최적화) 화면에 보이지 않는 뷰를 자동으로 제거 (android default; true) / 중첩스크롤뷰, 애니메이션 및 트랜지션, 데이터 변동이 많은 경우 의 경우에는 다시 복구되지 않을 수 있음
        // viewabilityConfig={{
        //   itemVisiblePercentThreshold: 0, // 항목의 몇 퍼센트가 보여야 보이는 것으로 간주할지 설정 (viewAreaCoveragePercentThreshold 와 동시에 사용 불가)
        //   viewAreaCoveragePercentThreshold: 50, // 화면의 몇 퍼센트가 항목을 덮고 있을 때 해당 항목을 보이는 것으로 간주할지 설정 (itemVisiblePercentThreshold 와 동시에 사용 불가)
        //   minimumViewTime: 0, // 항목이 보이는 것으로 간주되기 전 화면에 얼마나 오래 머물러야 하는지 (ms)
        //   waitForInteraction: true, // true 설정 시 사용자가 상호작용하기 전까지 가시성 이벤트가 발생하지 않음
        // }}
        // viewabilityConfigCallbackPairs
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  itemContainer: {
    flex: 1,
    // width: 70,
    // padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default Test2;
