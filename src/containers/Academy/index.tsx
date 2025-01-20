import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import Header from '#components/common/Header/Header.tsx';
import AcademyList from '#containers/Academy/components/AcademyList.tsx';
import NoAcademy from '#containers/Academy/components/NoAcademy.tsx';
import RefreshAcademyList from '#containers/Academy/components/RefreshAcademyList.tsx';
import {useGetInvitedList} from '#containers/Academy/hooks/useApi.ts';
import {usePreviousScreenName} from '#hooks/useNavigation.ts';

const Academy = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const prevScreenName = usePreviousScreenName(navigation);
  const {data: invitedList, refetch: invitedRefetch, isLoading} = useGetInvitedList();

  return (
    <CSafeAreaView edges={['top', 'bottom']}>
      <Header
        title="기관 추가"
        isBack={!!prevScreenName}
        navigation={navigation}
        rightChildren={<RefreshAcademyList refetch={invitedRefetch} />}
      />
      <CView>
        {invitedList && invitedList.invitedList.length > 0 ? (
          <AcademyList
            refetch={invitedRefetch}
            navigation={navigation}
            isLoading={isLoading}
            invitedList={invitedList}
            prevScreenName={prevScreenName}
          />
        ) : (
          <NoAcademy navigation={navigation} prevScreenName={prevScreenName} />
        )}
      </CView>
    </CSafeAreaView>
  );
};

export default Academy;
