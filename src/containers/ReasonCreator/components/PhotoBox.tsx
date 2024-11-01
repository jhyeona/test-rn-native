import * as React from 'react';
import {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';
import FileUploader from '#containers/ReasonCreator/components/FileUploader.tsx';

const PhotoBox = ({
  isDefault,
  source,
  onPressDelete,
  disabled,
  handleImgList,
}: {
  isDefault?: boolean;
  source?: string;
  onPressDelete?: () => void;
  disabled?: boolean;
  handleImgList?: (assets: any) => void;
}) => {
  const [uploadTypeState, setUploadTypeState] = useState<{
    isShow: boolean;
    typeList: number[];
  }>({
    isShow: false,
    typeList: [1, 2],
  });

  const handleUploader = () => {
    setUploadTypeState(prev => ({...prev, isShow: !prev.isShow}));
  };

  return (
    <>
      <View style={styles.container}>
        {isDefault ? (
          <TouchableOpacity
            disabled={disabled}
            onPress={handleUploader}
            style={[styles.photo, disabled && styles.disabled]}>
            <SvgIcon name="Camera" width={25} height={25} />
          </TouchableOpacity>
        ) : (
          <View style={styles.photo}>
            {!disabled && (
              <TouchableOpacity disabled={disabled} onPress={onPressDelete} style={styles.close}>
                <SvgIcon name="Close" width={10} height={10} />
              </TouchableOpacity>
            )}
            <Image
              src={source}
              // source={{uri: source}}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      </View>
      {/* 첨부 파일 등록 */}
      <View
        style={[
          styles.uploader,
          {
            display: uploadTypeState.isShow ? 'flex' : 'none',
          },
        ]}>
        {uploadTypeState.typeList.map((type, index) => {
          return (
            <FileUploader
              handleImgList={handleImgList}
              key={index}
              uploaderType={type}
              setHidden={handleUploader}
            />
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row'},
  uploader: {
    gap: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 15,
    position: 'absolute',
    bottom: '110%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 7,
    zIndex: 999,
  },
  container: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: COLORS.layout,
    borderRadius: 7,
  },
  photo: {
    width: '100%',
    aspectRatio: 1, // 1:1 비율 유지
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
  },
  disabled: {
    backgroundColor: COLORS.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  close: {
    zIndex: 2,
    padding: 3,
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.layout,
    borderRadius: 30,
  },
});

export default PhotoBox;
