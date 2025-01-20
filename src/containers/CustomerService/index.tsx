import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import {CustomScrollView} from '#components/common/CustomScrollComponents';
import Header from '#components/common/Header/Header.tsx';
import {PrivacyPolicyUrl, TermsOfLocationUrl, TermsOfServiceUrl} from '#constants/policy.ts';
import MenuButton from '#containers/Settings/components/MenuButton.tsx';
import {useGetUserInfo} from '#hooks/useUser.ts';

export interface CSRouteProps {
  policyName: string;
  policyUrl: string;
}

export const policyItems = [
  {policyName: '이용약관', policyUrl: TermsOfServiceUrl},
  {policyName: '위치기반 서비스 이용약관', policyUrl: TermsOfLocationUrl},
  {policyName: '개인(위치) 정보 처리방침', policyUrl: PrivacyPolicyUrl},
];

const CustomerService = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const {isTester} = useGetUserInfo();

  const handleNavigate = (page: string, params?: CSRouteProps) => {
    navigation.navigate(page, params);
  };

  return (
    <CSafeAreaView>
      <Header title="고객센터" navigation={navigation} isBack />
      <CustomScrollView>
        {policyItems.map(item => (
          <MenuButton
            key={`policy-menu-${item.policyName}`}
            title={item.policyName}
            onPress={() => handleNavigate('PolicyWebView', item)}
          />
        ))}
        {!isTester && (
          <MenuButton title="회원탈퇴" onPress={() => handleNavigate('UserWithdraw')} />
        )}
      </CustomScrollView>
    </CSafeAreaView>
  );
};

export default CustomerService;
