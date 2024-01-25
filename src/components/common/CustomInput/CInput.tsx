import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import CText from '../CustomText/CText.tsx';
import {COLORS} from '../../../constants/colors.ts';

interface Props {
  title: string;
  errorMessage?: string;
  placeholder?: string;
  inputValue: string;
  setInputValue: (text: string) => void;
  isWarning?: boolean;
  secureTextEntry?: boolean;
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
  } = props;
  return (
    <View style={{width: '100%'}}>
      <View style={styles.titleContainer}>
        <CText text={title} fontWeight="600" />
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
          style={styles.input}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    padding: 16,
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
  },
  errorMessage: {marginLeft: 8, color: COLORS.warning, fontSize: 12},
});
export default CInput;
