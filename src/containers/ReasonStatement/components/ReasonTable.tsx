import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';

import moment from 'moment/moment';

import CText from '#components/common/CustomText/CText.tsx';
import NoData from '#components/common/NoData';
import StatusInfoContainer from '#components/common/StatusInfoContainer';
import {COLORS} from '#constants/colors.ts';
const ListHeader = () => {
  return (
    <View style={styles.header}>
      <CText style={styles.row1} fontWeight="700" text="강의명" />
      <CText style={styles.row2} fontWeight="700" text="상세 내용" />
      <CText style={styles.row3} fontWeight="700" text="처리 상태" />
    </View>
  );
};

const ReasonTable = () => {
  const renderItem: ListRenderItem<string> = ({item, index}) => {
    return (
      <View key={`reason-item-${index}`} style={styles.row}>
        <View style={styles.row1}>
          <CText text="lecture Name" />
          <CText
            color={COLORS.placeholder}
            text={moment().format('YY.MM.DD')}
          />
        </View>
        <View style={styles.row2}>
          <CText text="content..." />
        </View>
        <View style={styles.row3}>
          <StatusInfoContainer colorType="blue" text="승인" />
          <StatusInfoContainer colorType="gray" text="미승인" />
          <StatusInfoContainer colorType="red" text="반려" />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={<ListHeader />}
      data={['data1', 'data2', 'data3']}
      renderItem={renderItem}
      ListEmptyComponent={
        <NoData fullHeight message="📝 작성된 사유서가 없습니다." />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 50,
    borderBottomWidth: 1,
    borderColor: COLORS.lineBlue,
  },
  row: {
    gap: 10,
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.lineBlue,
  },
  row1: {
    flex: 0.3,
  },
  row2: {
    flex: 0.5,
  },
  row3: {
    flex: 0.2,
    borderWidth: 1,
  },
});

export default ReasonTable;
