import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import globalState from '../../../recoil/Global';
import {COLORS} from '../../../constants/colors.ts';

const LoadingIndicator = () => {
  const isLoading = useRecoilValue(globalState.globalLoadingState);
  return (
    <>
      {isLoading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </>
  );
};

export default LoadingIndicator;
