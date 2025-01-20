import {TouchableOpacity} from 'react-native';

import SvgIcon from '#components/common/Icon/Icon.tsx';
import {RefetchProps} from '#types/common.ts';
import {InvitedAcademyListProps} from '#types/user.ts';

const RefreshAcademyList = ({refetch: invitedRefetch}: RefetchProps<InvitedAcademyListProps>) => {
  return (
    <TouchableOpacity
      onPress={async () => await invitedRefetch()}
      style={{justifyContent: 'center', alignItems: 'center'}}>
      <SvgIcon name="Refresh" />
    </TouchableOpacity>
  );
};

export default RefreshAcademyList;
