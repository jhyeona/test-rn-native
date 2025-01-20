import {StyleSheet, View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';

const ProgressStatusNumber = ({
  currentNumber,
  lastNumber,
}: {
  currentNumber: number;
  lastNumber: number;
}) => {
  return (
    <View style={styles.container}>
      <CText
        text={`${currentNumber}/${lastNumber}`}
        fontSize={20}
        fontWeight="700"
        color={COLORS.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
});

export default ProgressStatusNumber;
