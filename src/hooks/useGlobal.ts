import {useWindowDimensions} from 'react-native';

export const useChangeWidth = () => {
  const {width} = useWindowDimensions();
  return width - 48;
};
