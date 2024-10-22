import React, {ReactNode} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {InputModeOptions} from 'react-native/Libraries/Components/TextInput/TextInput';
import {DimensionValue} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';

interface Props {
  title?: string;
  errorMessage?: string;
  placeholder?: string;
  inputValue: string;
  setInputValue: (text: string) => void;
  isWarning?: boolean;
  secureTextEntry?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  inputMode?: InputModeOptions;
  width?: DimensionValue;
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
    width,
    fontSize,
    children,
  } = props;

  return (
    <View style={{width: width ?? '100%'}}>
      <View style={styles.titleContainer}>
        {children ?? (
          <CText text={title} fontWeight={'500'} fontSize={fontSize} />
        )}
      </View>
      <View style={{gap: 5, marginBottom: 10}}>
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
        <CText
          text={isWarning ? errorMessage : ''}
          style={styles.errorMessage}
          fontSize={12}
          color={COLORS.warning}
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
    borderWidth: 1,
    borderRadius: 7,
    borderColor: COLORS.layout,
  },
  titleContainer: {
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    color: 'black',
  },
  errorMessage: {
    marginLeft: 4,
  },
});
export default CInput;
