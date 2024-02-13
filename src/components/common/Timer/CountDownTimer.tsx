import React, {useState, useEffect} from 'react';
import CText from '../CustomText/CText.tsx';
import {COLORS} from '../../../constants/colors.ts';

interface CountDownTimerProps {
  secondTime?: number;
  handleTimeout?: (timeout: boolean) => void;
}

const CountDownTimer = (props: CountDownTimerProps) => {
  const {secondTime = 0, handleTimeout} = props;
  const [time, setTime] = useState(secondTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(prevTime => {
        if (prevTime === 0) {
          if (handleTimeout) {
            handleTimeout(true);
          }
          clearInterval(intervalId);
          return prevTime;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const minutes = Math.floor(time / 60); // 분
  const seconds = time % 60; // 초

  return (
    <CText
      text={`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
      color={COLORS.warning}
      fontSize={12}
    />
  );
};

export default CountDownTimer;
