import React from 'react';
import {ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import {COLORS} from '#constants/colors.ts';
import absoluteFillObject = StyleSheet.absoluteFillObject;
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {WebView} from 'react-native-webview';

interface WebViewProps {
  uri: string;
  startInLoadingState?: boolean;
  size?: 'small' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const CWebView = (props: WebViewProps) => {
  const {
    uri,
    startInLoadingState = true,
    size = 'small',
    color = COLORS.primary,
    style,
  } = props;

  return (
    <WebView
      style={style}
      source={{uri: uri}}
      startInLoadingState={startInLoadingState}
      originWhitelist={['*']}
      renderLoading={() => (
        <ActivityIndicator
          size={size}
          color={color}
          style={{...absoluteFillObject}}
        />
      )}
    />
  );
};

export default CWebView;
