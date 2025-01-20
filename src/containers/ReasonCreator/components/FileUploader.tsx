import * as React from 'react';
import {useEffect} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {useSetRecoilState} from 'recoil';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {ACTIONS} from '#constants/imageActions.ts';
import {requestCameraPermissions, requestLibraryPermissions} from '#permissions/index.ts';
import {handleOpenSettings} from '#permissions/utils/permissionsHepler.ts';
import {checkPermissionWithModal} from '#permissions/utils/withModalHelper.ts';
import GlobalState from '#recoil/Global';
import {globalModalState} from '#recoil/Global/atom.ts';

/**
 * fileType: number 1~6
 * 1: 사진 촬영
 * 2: 갤러리 접근 - 사진만 선택
 * 3: 동영상 촬영
 * 4: 갤러리 접근 - 동영상만 선택
 * 5: (only IOS) 사진 및 동영상 촬영
 * 6: 사진 및 동영상 선택
 * */
const FileUploader = ({
  uploaderType,
  setHidden,
  handleImgList,
}: {
  uploaderType: number;
  setHidden: () => void;
  handleImgList?: (assets: any) => void;
}) => {
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);

  const [response, setResponse] = React.useState<any>(null);

  const onButtonPress = React.useCallback(async (type: number) => {
    setHidden();

    const action = ACTIONS[type - 1];
    if (!action) {
      console.log('올바르지 않은 타입을 설정했습니다.');
      return;
    }

    // 권한 타입 및 실행 함수 설정
    const isLibrary = type % 2 === 0; // 짝수면 갤러리, 홀수면 카메라
    const permissionType = isLibrary ? 'library' : 'camera';
    const actionLauncher = isLibrary ? launchImageLibrary : launchCamera;

    // 권한 확인 후 실행
    const hasPermission = await checkPermissionWithModal({
      requestType: permissionType,
      setGlobalModalState,
    });

    if (!hasPermission) return;

    await actionLauncher(action.options, setResponse);
  }, []);

  useEffect(() => {
    if (response?.assets?.length) {
      if (handleImgList) handleImgList(response.assets);
    }
  }, [response]);

  return (
    <TouchableOpacity onPress={() => onButtonPress(uploaderType)} style={styles.container}>
      <CText text={ACTIONS[uploaderType - 1].title} />
      <SvgIcon name={uploaderType % 2 === 0 ? 'Gallery' : 'Camera'} width={18} height={18} />
    </TouchableOpacity>

    // <SafeAreaView style={styles.container}>
    //   <Text>🌄 React Native Image Picker</Text>
    //   <ScrollView>
    //     <View style={styles.buttonContainer}>
    //       {actions.map(({title, type, options}) => {
    //         return (
    //           <Button
    //             title={title}
    //             key={title}
    //             onPress={() => onButtonPress(type, options)}
    //           />
    //         );
    //       })}
    //     </View>
    //     {response?.assets &&
    //       response?.assets.map(({uri}: {uri: string}) => (
    //         <View key={uri} style={styles.imageContainer}>
    //           <Image
    //             resizeMode="cover"
    //             resizeMethod="scale"
    //             style={styles.image}
    //             source={{uri: uri}}
    //           />
    //         </View>
    //       ))}
    //   </ScrollView>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default FileUploader;
