import React from 'react';
import {ViewStyle} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {WebView} from 'react-native-webview';
import LoadingIndicator from '#components/common/Loading/LoadingIndicator.tsx';

interface WebViewProps {
  uri: string;
  startInLoadingState?: boolean;
  size?: 'small' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const CWebView = (props: WebViewProps) => {
  const {uri, startInLoadingState = true, style} = props;

  return (
    <WebView
      style={style}
      source={{uri: uri}}
      startInLoadingState={startInLoadingState}
      originWhitelist={['*']}
      renderLoading={() => <LoadingIndicator autoLoading />}
    />
  );
};

export default CWebView;
