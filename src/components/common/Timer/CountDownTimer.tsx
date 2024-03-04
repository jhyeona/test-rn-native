import React, {useState, useEffect} from 'react';
import CText from '../CustomText/CText.tsx';
import {COLORS} from '../../../constants/colors.ts';

interface CountDownTimerProps {
  secondTime?: number;
  handleTimeout?: (timeout: boolean) => void;
  onChangeTimeHandler?: (time: number) => void;
  restart?: boolean;
}

const CountDownTimer = (props: CountDownTimerProps) => {
  const {secondTime = 0, onChangeTimeHandler, handleTimeout, restart} = props;
  const [time, setTime] = useState(secondTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(prevTime => {
        if (prevTime === 0) {
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

  useEffect(() => {
    if (handleTimeout && time === 0) {
      handleTimeout(true);
    }
    if (onChangeTimeHandler) {
      onChangeTimeHandler(time);
    }
  }, [handleTimeout, onChangeTimeHandler, time]);

  const minutes = Math.floor(time / 60); // 분
  const seconds = time % 60; // 초

  useEffect(() => {
    if (restart) {
      setTime(secondTime);
    }
  }, [restart, secondTime]);

  return (
    <CText
      text={`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
      color={COLORS.warning}
      fontSize={12}
    />
  );
};

export default CountDownTimer;
