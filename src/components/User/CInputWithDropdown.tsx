import React, {ReactNode} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {InputModeOptions} from 'react-native/Libraries/Components/TextInput/TextInput';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

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
  fontSize?: number;
  children?: ReactNode;
  visiblePosition?: 'absolute' | 'relative' | 'static' | undefined;
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
    fontSize,
    children,
    visiblePosition,
  } = props;
  return (
    <View style={{flex: 1, marginBottom: 8}}>
      <View style={styles.titleContainer}>
        {children ?? <CText text={title} fontWeight={'500'} fontSize={fontSize} />}
      </View>
      <View style={{gap: 10, flexDirection: 'row'}}>
        <View style={{flex: 1}}>
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
          <CText
            text={isWarning ? errorMessage : ''}
            style={styles.errorMessage}
            fontSize={12}
            color={COLORS.warning}
          />
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
            visiblePosition={visiblePosition}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
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
  errorMessage: {
    margin: 4,
    color: COLORS.warning,
    fontSize: 12,
  },
});
export default CInputWithDropdown;
