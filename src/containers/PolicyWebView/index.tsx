import {RouteProp} from '@react-navigation/core/src/types.tsx';
import {useRoute} from '@react-navigation/native';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import Header from '#components/common/Header/Header.tsx';
import CWebView from '#components/common/WebView/CWebView.tsx';
import {CSRouteProps} from '#containers/CustomerService';

const PolicyWebView = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const route = useRoute<RouteProp<{PolicyWebView: CSRouteProps}>>();
  const {policyUrl, policyName} = route.params;

  return (
    <CSafeAreaView edges={['top', 'bottom']}>
      <Header title={policyName} isBack navigation={navigation} />
      <CView>
        <CWebView uri={policyUrl} />
      </CView>
    </CSafeAreaView>
  );
};

export default PolicyWebView;
