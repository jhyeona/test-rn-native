import {StyleSheet, View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';

interface NoDataProps {
  fullHeight?: boolean;
  message?: string;
}

const NoData = ({fullHeight = false, message}: NoDataProps) => {
  return (
    <View style={[styles.container, {height: fullHeight ? '80%' : 'auto'}]}>
      <CText
        text={message ?? '🐣 데이터가 없습니다.'}
        color={COLORS.gray}
        fontSize={17}
      />
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
