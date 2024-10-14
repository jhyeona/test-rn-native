import React, {ReactNode} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {InputModeOptions} from 'react-native/Libraries/Components/TextInput/TextInput';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {
  DimensionValue,
  ViewStyle,
} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';

import Dropdown from '../common/Dropdown/Dropdown.tsx';

interface ItemProps {
  label: string;
  id: string;
}

interface Props {
  title: string;
  errorMessage?: string;
  placeholder?: string;
  inputValue: string;
  setInputValue: (text: string) => void;
  dropDownItems: Array<ItemProps>;
  dropDownOnSelect: (item: ItemProps) => void;
  dropDownDisabled?: boolean;
  dropDownPlaceHolder?: string;
  dropDownStyle?: StyleProp<ViewStyle>;
  dropdownSelected?: ItemProps;
  isWarning?: boolean;
  secureTextEntry?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  inputMode?: InputModeOptions;
  fullWidth?: DimensionValue;
  fontSize?: number;
  children?: ReactNode;
}
const CInputWithDropdown = (props: Props) => {
  const {
    title,
    errorMessage,
    placeholder,
    inputValue = '',
    setInputValue,
    dropDownItems,
    dropDownOnSelect,
    dropDownDisabled,
    dropDownPlaceHolder,
    dropDownStyle,
    dropdownSelected,
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
        {isWarning && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      </View>
      <View style={{flexDirection: 'row'}}>
        <View
          style={[
            styles.inputContainer,
            {borderColor: isWarning ? COLORS.warning : COLORS.layout},
          ]}>
          <View style={{flex: 1}}>
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={COLORS.placeholder}
              onChangeText={text => setInputValue(text)}
              value={inputValue}
              style={[styles.input, {flex: 1, fontSize: fontSize ?? 14}]}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              readOnly={readOnly}
              maxLength={maxLength}
              inputMode={inputMode}
            />
          </View>
        </View>
        <View style={{flex: 1}}>
          <Dropdown
            items={dropDownItems}
            onSelect={dropDownOnSelect}
            selected={dropdownSelected}
            height={52}
            fontSize={16}
            placeholder={dropDownPlaceHolder}
            disabled={dropDownDisabled}
            style={dropDownStyle}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'center',
    marginBottom: 24,
    marginRight: 10,
    paddingHorizontal: 16,
    height: 52,
    flex: 1,
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
  errorMessage: {marginLeft: 8, color: COLORS.warning, fontSize: 12},
});
export default CInputWithDropdown;
