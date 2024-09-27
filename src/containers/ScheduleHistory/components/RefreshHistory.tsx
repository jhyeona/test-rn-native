import React from 'react';
import {TouchableOpacity, View} from 'react-native';

import SvgIcon from '#components/common/Icon/Icon.tsx';

interface RefreshHistoryProps {
  handleRefresh: () => void;
}

const RefreshHistory = ({handleRefresh}: RefreshHistoryProps) => {
  return (
    <TouchableOpacity onPress={handleRefresh}>
      <View>
        <SvgIcon name="Refresh" size={24} />
      </View>
    </TouchableOpacity>
  );
};

export default RefreshHistory;
