import React from 'react';
import 'react-native-gesture-handler';
import {RecoilRoot} from 'recoil';
import RootStackNavigation from './src/navigation/RootStackNavigation';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();
function App(): React.JSX.Element {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <RootStackNavigation />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
