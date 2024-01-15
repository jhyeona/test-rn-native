import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {RecoilRoot} from 'recoil';
import RootStackNavigation from './src/navigation/RootStackNavigation';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import BootSplash from 'react-native-bootsplash';
import {storage} from './src/utils/storageHelper.ts';

const queryClient = new QueryClient();
function App(): React.JSX.Element {
  const token = storage.getString('jwtToken');

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
    });
  }, []);

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <RootStackNavigation isLoggedIn={!!token} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
