import {StyleSheet, View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';

interface NoDataProps {
  fullHeight?: boolean;
}

const NoData = ({fullHeight = false}: NoDataProps) => {
  return (
    <View style={[styles.container, {height: fullHeight ? '100%' : 'auto'}]}>
      <CText text="🐣 데이터가 없습니다." fontSize={17} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    textAlign: 'center',
  },
});

export default NoData;
