import React, {ReactNode} from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface CViewProps {
  children: ReactNode;
  isInput?: boolean;
}
const CView = (props: CViewProps) => {
  const {isInput = false, children} = props;
  return (
    <>
      {isInput ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>{children}</View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.container}>{children}</View>
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
