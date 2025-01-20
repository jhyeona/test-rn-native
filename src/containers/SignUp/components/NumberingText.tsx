import {StyleSheet, View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';

const NumberingText = ({index, text}: {index: number; text: string}) => {
  return (
    <View style={styles.container}>
      <View style={styles.number}>
        <CText text={index.toString()} color="white" fontWeight="700" />
      </View>
      <CText text={text} fontSize={16} lineBreak style={{flexShrink: 1}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
  number: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
  },
});

export default NumberingText;
