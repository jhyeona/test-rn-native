import {RefreshControl} from 'react-native';

import {COLORS} from '#constants/colors.ts';

export interface RefreshIndicatorProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export const createRefreshControl = ({refreshing, onRefresh}: RefreshIndicatorProps) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={COLORS.primary}
      colors={[COLORS.primary, COLORS.warning]}
    />
  );
};
