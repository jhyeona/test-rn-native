import {ReactNode} from 'react';
import {KeyboardAvoidingView, StyleSheet} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import {IS_IOS} from '#constants/common.ts';

const CKeyboardAvoidingView = ({
  children,
  keyboardVerticalOffset,
  style,
}: {
  children?: ReactNode;
  keyboardVerticalOffset?: number;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset ?? 0}
      style={[styles.container, style]}
      behavior={IS_IOS ? 'padding' : 'height'}>
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default CKeyboardAvoidingView;
