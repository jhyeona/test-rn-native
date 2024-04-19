import React, {ReactNode} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';
import {InputModeOptions} from 'react-native/Libraries/Components/TextInput/TextInput';
import {DimensionValue} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

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
  fullWidth?: DimensionValue;
  fontSize?: number;
  children?: ReactNode;
}
const CInput = (props: Props) => {
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
    fullWidth,
    fontSize,
    children,
  } = props;

  return (
    <View style={{width: fullWidth ?? '100%'}}>
      <View style={styles.titleContainer}>
        {children ?? (
          <CText text={title} fontWeight={'500'} fontSize={fontSize} />
        )}
        {isWarning && (
          <CText
            text={errorMessage ?? ''}
            style={styles.errorMessage}
            fontSize={12}
            color={COLORS.warning}
          />
        )}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
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
    fontSize: 16,
    color: 'black',
  },
  errorMessage: {marginLeft: 8},
});
export default CInput;
