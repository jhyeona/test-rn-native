import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '#constants/colors.ts';
import CText from '#components/common/CustomText/CText.tsx';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

interface TextListProps {
  textList: Array<string>;
  style?: StyleProp<ViewStyle>;
}

const TextList = (props: TextListProps) => {
  const {textList, style} = props;
  return (
    <View style={style}>
      {textList.map((text, i) => {
        return (
          <View key={i} style={styles.container}>
            <View style={styles.disc} />
            <CText
              text={text}
              fontSize={16}
              lineBreak
              style={{flex: 1}}
              lineHeight={25}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', marginVertical: 5},
  disc: {
    width: 6,
    height: 6,
    borderRadius: 30,
    marginRight: 16,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: COLORS.primary,
  },
});

export default TextList;
