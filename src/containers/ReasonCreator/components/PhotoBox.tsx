import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {ImageSourcePropType} from 'react-native/Libraries/Image/Image';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment from 'moment/moment';

import SvgIcon from '#components/common/Icon/Icon.tsx';

const PhotoBox = ({
  isDefault,
  source,
}: {
  isDefault?: boolean;
  source?: ImageSourcePropType;
}) => {
  return (
    <>
      <View style={styles.container}>
        {isDefault ? (
          <SvgIcon name="Camera" width={20} height={20} />
        ) : (
          <Image source={source} style={styles.image} resizeMode="cover" />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default PhotoBox;
