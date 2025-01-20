import React, {ReactNode} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {InputModeOptions} from 'react-native/Libraries/Components/TextInput/TextInput';
import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';
import CountDownTimer from '#components/common/Timer/CountDownTimer.tsx';

interface Props {
  title: string;
  errorMessage?: string;
  placeholder?: string;
  inputValue: string;
  setInputValue: (text: string) => void;
  isWarning?: boolean;
  secureTextEntry?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  inputMode?: InputModeOptions;
  fontSize?: number;
  children?: ReactNode;
  timer?: boolean;
  setTime?: number;
  onChangeTimeHandler?: (time: number) => void;
  handleTimeout?: (timeout: boolean) => void;
  restart?: boolean;
}
const CInputWithTimer = (props: Props) => {
  const {
    title,
    errorMessage,
    placeholder,
    inputValue,
    setInputValue,
    isWarning,
    secureTextEntry,
    readOnly,
    maxLength,
    inputMode,
    fontSize,
    children,
    timer,
    setTime,
    onChangeTimeHandler,
    handleTimeout,
    restart,
  } = props;

  return (
    <View style={{flex: 1, marginRight: 10}}>
      <View style={styles.titleContainer}>
        {children ?? (
          <CText text={title} fontWeight={'500'} fontSize={fontSize} />
        )}
        {isWarning && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      </View>
      <View
        style={[
          styles.inputContainer,
          {borderColor: isWarning ? COLORS.warning : COLORS.layout},
        ]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          onChangeText={text => setInputValue(text)}
          value={inputValue}
          style={[styles.input, {fontSize: fontSize ?? 14}]}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          readOnly={readOnly}
          maxLength={maxLength}
          inputMode={inputMode}
        />
        {timer ? (
          <CountDownTimer
            secondTime={setTime}
            handleTimeout={handleTimeout}
            onChangeTimeHandler={onChangeTimeHandler}
            restart={restart}
          />
        ) : (
          <CText text="0:00" fontSize={12} color={COLORS.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    height: 52,
    marginBottom: 24,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: COLORS.layout,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  errorMessage: {marginLeft: 8, color: COLORS.warning, fontSize: 12},
});
export default CInputWithTimer;
