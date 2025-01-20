import React from 'react';
import Config from 'react-native-config';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import * as Sentry from '@sentry/react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RecoilRoot} from 'recoil';

import LoadingIndicator from './src/components/common/Loading/LoadingIndicator.tsx';
import GlobalModal from './src/components/common/Modal/GlobalModal.tsx';
import GlobalToast from './src/components/common/Toast/GlobalToast.tsx';
import RootStackNavigation from './src/navigation/RootStackNavigation';

import 'moment/locale/ko';

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: Config.SENTRY_KEY,
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  environment: Config.ENV,
});

Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
  routeChangeTimeoutMs: 1_000,
  ignoreEmptyBackNavigationTransactions: true,
});

const queryClient = new QueryClient();
function App(): React.JSX.Element {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{flex: 1}}>
          <RootStackNavigation navigationIntegration={navigationIntegration} />
          <GlobalModal />
          <GlobalToast />
          <LoadingIndicator />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default Sentry.wrap(App);
