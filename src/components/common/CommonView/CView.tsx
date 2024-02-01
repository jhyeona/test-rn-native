import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {
  children: ReactNode;
}

const CView = (props: Props) => {
  const {children} = props;
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 24,
  },
});

export default CView;
