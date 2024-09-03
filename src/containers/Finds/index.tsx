import React from 'react';
import {ScrollView, View} from 'react-native';

import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';

const Finds = () => {
  return (
    <CSafeAreaView>
      <Header title="조회" />
      <ScrollView>
        <CView>
          <View>
            <CText text="FINDS" />
          </View>
        </CView>
      </ScrollView>
    </CSafeAreaView>
  );
};

export default Finds;
