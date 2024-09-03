import React from 'react';
import {ScrollView, View} from 'react-native';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';

const WeeklySchedules = () => {
  return (
    <CSafeAreaView>
      <Header title="주간 캘린더" />
      <ScrollView>
        <CView>
          <CText text="주간 캘린더" />
        </CView>
      </ScrollView>
    </CSafeAreaView>
  );
};

export default WeeklySchedules;
