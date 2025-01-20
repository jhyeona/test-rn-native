import React from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';

import {useRecoilValue} from 'recoil';

import {COLORS} from '#constants/colors.ts';
import GlobalState from '#recoil/Global';

interface LoadingIndicatorProps {
  autoLoading?: boolean;
}

const LoadingIndicator = (props: LoadingIndicatorProps) => {
  const {autoLoading = false} = props;
  const isLoading = useRecoilValue(GlobalState.globalLoadingState);
  return (
    <>
      {(isLoading || autoLoading) && (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});

export default LoadingIndicator;
