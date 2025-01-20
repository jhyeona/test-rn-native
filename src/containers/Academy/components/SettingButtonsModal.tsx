import {View} from 'react-native';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

import CButton from '#components/common/CommonButton/CButton.tsx';
import DefaultModal from '#components/common/Modal/DefaultModal.tsx';
import {policyTitle} from '#containers/Academy/components/NoAcademy.tsx';
import {CSRouteProps, policyItems} from '#containers/CustomerService';

const SettingButtonsModal = ({
  isVisible,
  onPressCancel,
  navigation,
}: {
  isVisible: boolean;
  onPressCancel: (isVisible: boolean) => void;
  navigation: NativeStackNavigationHelpers;
}) => {
  const onPressPolicy = (item: CSRouteProps) => {
    navigation.navigate('PolicyWebView', item);
    onPressCancel(false);
  };

  const onPressUserWithdraw = () => {
    navigation.navigate('UserWithdraw');
    onPressCancel(false);
  };

  return (
    <DefaultModal isVisible={isVisible} onPressCancel={onPressCancel} title={policyTitle}>
      <View style={{gap: 10}}>
        {policyItems.map(item => (
          <CButton
            key={`no-academy-policy-menu-${item.policyName}`}
            text={item.policyName}
            onPress={() => onPressPolicy(item)}
            whiteButton
            noMargin
          />
        ))}
        <CButton text="회원탈퇴" onPress={onPressUserWithdraw} whiteButton noMargin />
      </View>
    </DefaultModal>
  );
};

export default SettingButtonsModal;
