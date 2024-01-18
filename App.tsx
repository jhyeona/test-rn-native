import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RecoilRoot} from 'recoil';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import RootStackNavigation from './src/navigation/RootStackNavigation';

const queryClient = new QueryClient();
function App(): React.JSX.Element {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{flex: 1}}>
          <RootStackNavigation />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
