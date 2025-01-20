import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';

import {RefetchProps} from '#types/common.ts';
import {InvitedAcademyListProps} from '#types/user.ts';

export interface NoAcademyProps {
  prevScreenName?: string;
  navigation: NativeStackNavigationHelpers;
}

export interface AcademyListProps extends RefetchProps<InvitedAcademyListProps> {
  invitedList?: InvitedAcademyListProps;
  prevScreenName?: string;
  navigation: NativeStackNavigationHelpers;
  isLoading: boolean;
}

export interface CheckboxStateProps {
  isChecked: boolean;
  id: string;
  type: string;
  time: string;
  academy: {
    academyId: string;
    name: string;
    picture?: string | null;
  };
}
