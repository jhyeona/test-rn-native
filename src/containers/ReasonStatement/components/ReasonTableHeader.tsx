import React from 'react';
import {View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import {reasonListTableStyles} from '#containers/ReasonStatement/styles';

const ListHeader = () => {
  return (
    <View style={reasonListTableStyles.header}>
      <CText
        style={reasonListTableStyles.row1}
        fontWeight="700"
        text="강의명"
      />
      <CText
        style={reasonListTableStyles.row2}
        fontWeight="700"
        text="상세 내용"
      />
      <CText
        style={reasonListTableStyles.row3}
        fontWeight="700"
        text="처리 상태"
      />
    </View>
  );
};

export default ListHeader;
