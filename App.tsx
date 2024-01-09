import React from 'react';
import 'react-native-gesture-handler';
import {RecoilRoot} from 'recoil';
import RootStackNavigation from './src/navigation/RootStackNavigation';

function App(): React.JSX.Element {
  return (
    <RecoilRoot>
      <RootStackNavigation />
    </RecoilRoot>
  );
}

export default App;
