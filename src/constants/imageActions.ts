import {Platform} from 'react-native';
import {CameraOptions, ImageLibraryOptions} from 'react-native-image-picker';

type ActionType = 'capture' | 'library';
interface Action {
  index: number;
  title: string;
  type: ActionType;
  options: CameraOptions | ImageLibraryOptions;
}

const includeExtra = true;
export const ACTIONS: Action[] = [
  {
    index: 1,
    title: '사진 찍기',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    index: 2,
    title: '사진 보관함',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    index: 3,
    title: '동영상 찍기',
    type: 'capture',
    options: {
      saveToPhotos: true,
      formatAsMp4: true,
      mediaType: 'video',
      includeExtra,
    },
  },
  {
    index: 4,
    title: '동영상 보관함',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'video',
      formatAsMp4: true,
      includeExtra,
    },
  },
  {
    index: 6,
    title: '사진 및 동영상 보관함',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'mixed',
      includeExtra,
    },
  },
];

if (Platform.OS === 'ios') {
  ACTIONS.push({
    index: 5,
    title: '사진 및 동영상 촬영',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'mixed',
      includeExtra,
      presentationStyle: 'fullScreen',
    },
  });
}
