import {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import moment from 'moment';

import CText from '#components/common/CustomText/CText.tsx';
import StatusInfoContainer from '#components/common/StatusInfoContainer';
import {COLORS} from '#constants/colors.ts';
import {REASON_STATUS_MAP} from '#constants/reason.ts';
import {reasonListTableStyles} from '#containers/ReasonStatement/styles';

interface ReasonTableItemProps {
  item: any;
  index: number;
  handleMovePage: (reasonId?: string) => void;
}

const ReasonTableItem = ({item, index, handleMovePage}: ReasonTableItemProps) => {
  const status = REASON_STATUS_MAP[item.status];
  return (
    <TouchableOpacity
      key={`reason-item-${index}`}
      style={reasonListTableStyles.row}
      onPress={() => handleMovePage(item.reasonId)}>
      <View style={reasonListTableStyles.row1}>
        <Text numberOfLines={2} ellipsizeMode="tail" lineBreakStrategyIOS="hangul-word">
          {item.lectureName}
        </Text>
        <CText
          color={COLORS.placeholder}
          text={moment(item.date).format('YY.MM.DD')}
          fontSize={12}
        />
      </View>
      <View style={reasonListTableStyles.row2}>
        <Text numberOfLines={2} ellipsizeMode="tail" lineBreakStrategyIOS="hangul-word">
          {item.content}
        </Text>
      </View>
      <View style={reasonListTableStyles.row3}>
        <StatusInfoContainer colorType={status.colorType} text={status.text} />
      </View>
    </TouchableOpacity>
  );
};

export default memo(ReasonTableItem);
