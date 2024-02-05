import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RecoilRoot} from 'recoil';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import RootStackNavigation from './src/navigation/RootStackNavigation';
import GlobalModal from './src/components/common/Modal/GlobalModal.tsx';
import LoadingIndicator from './src/components/common/Loading/LoadingIndicator.tsx';
import GlobalToast from './src/components/common/Toast/GlobalToast.tsx';

const queryClient = new QueryClient();
function App(): React.JSX.Element {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{flex: 1}}>
          <RootStackNavigation />
          <GlobalModal />
          <LoadingIndicator />
          <GlobalToast />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
