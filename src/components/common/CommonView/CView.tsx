import React, {ReactNode} from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

interface CViewProps {
  children: ReactNode;
  isInput?: boolean;
  style?: StyleProp<ViewStyle>;
}
const CView = (props: CViewProps) => {
  const {isInput = false, style, children} = props;
  return (
    <>
      {isInput ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, style]}>{children}</View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={[styles.container, style]}>{children}</View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 24,
  },
});

export default CView;
