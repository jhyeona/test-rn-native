import React, {ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {
  Edge,
  SafeAreaView as RNSafeAreaView,
} from 'react-native-safe-area-context';
const CSafeAreaView = (props: {edges?: Edge[]; children?: ReactNode}) => {
  const {edges, children} = props;
  return (
    <RNSafeAreaView edges={edges ?? ['top', 'bottom']} style={styles.container}>
      {children}
    </RNSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
export default CSafeAreaView;
