import {useEffect} from 'react';
import {useWindowDimensions} from 'react-native';

export const useChangeWidth = () => {
  const {width} = useWindowDimensions();
  return width - 48;
};

export const useGlobalInterval = (callback: () => void, interval: number) => {
  useEffect(() => {
    callback(); // 즉시 실행
    const id = setInterval(callback, interval);
    return () => clearInterval(id);
  }, [callback, interval]);
};
