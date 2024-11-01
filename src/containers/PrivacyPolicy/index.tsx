import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import Header from '#components/common/Header/Header.tsx';
import CWebView from '#components/common/WebView/CWebView.tsx';
import {PrivacyPolicyUrl} from '#constants/policy.ts';

const PrivacyPolicy = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  return (
    <CSafeAreaView edges={['top', 'bottom']}>
      <Header title="개인정보처리방침" isBack navigation={navigation} />
      <CView>
        <CWebView uri={PrivacyPolicyUrl} />
      </CView>
    </CSafeAreaView>
  );
};

export default PrivacyPolicy;
