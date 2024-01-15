import React, {useRef} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../../containers/SignIn';
import TabNavigation from '../TabNavigation';
import {logFBScreenView} from '../../utils/firebaseLogHelper.ts';
import SignUp from '../../containers/SignUp';
import FindPassword from '../../containers/FindPassword';

const RootStack = createNativeStackNavigator();

interface Props {
  isLoggedIn: boolean;
}

const RootStackNavigation = (props: Props) => {
  const {isLoggedIn} = props;
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string>();

  const onStateChangeHandler = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName: string =
      navigationRef?.current?.getCurrentRoute()?.name ?? '';

    if (previousRouteName !== currentRouteName) {
      await logFBScreenView(currentRouteName, currentRouteName);
    }
    routeNameRef.current = currentRouteName;
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current =
          navigationRef?.current?.getCurrentRoute()?.name ?? '';
      }}
      onStateChange={onStateChangeHandler}>
      <RootStack.Navigator initialRouteName={isLoggedIn ? 'Root' : 'SignIn'}>
        <RootStack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerTitle: ''}}
        />
        <RootStack.Screen
          name="FindPassword"
          component={FindPassword}
          options={{headerTitle: ''}}
        />
        <RootStack.Screen
          name="Root"
          component={TabNavigation}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigation;
