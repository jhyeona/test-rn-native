import React from 'react';
import {StyleSheet, View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';

const statusColorMap = {
  PASS: {
    styles: {
      borderColor: COLORS.dark.green,
      backgroundColor: COLORS.light.green,
    },
    text: COLORS.dark.green,
  },
  COMPLETE: {
    styles: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.light.blue,
    },
    text: COLORS.primary,
  },
  // 출석(예정) : COLOR: gray(disabled)
  // 결석 : COLOR: red(disabled)
};

const BtnScheduleAttend = () => {
  //TODO: color, text 를 설정할 때 status 값으로 설정하기
  const status = 'PASS';

  return (
    <View style={{gap: 10, marginTop: 10}}>
      {Array.from({length: 4}).map((_, i) => (
        <View key={i} style={{display: 'flex', flexDirection: 'row'}}>
          <View style={styles.scheduleInfo}>
            <CText
              text="1교시"
              fontSize={16}
              fontWeight="700"
              color={COLORS.primary}
            />
            <CText text="10:00 ~ 12:00" />
          </View>
          <View
            style={[styles.scheduleInfoButton, statusColorMap[status].styles]}>
            <CText text="PASS" color={statusColorMap[status].text} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  scheduleInfo: {
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: COLORS.light.gray,
    borderBottomLeftRadius: 7,
    borderTopLeftRadius: 7,
  },
  scheduleInfoButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderWidth: 1,
    borderBottomRightRadius: 7,
    borderTopRightRadius: 7,
  },
});

export default BtnScheduleAttend;
