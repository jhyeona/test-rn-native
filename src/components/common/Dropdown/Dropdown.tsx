import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, StyleSheet, Pressable} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {
  DimensionValue,
  ViewStyle,
} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';

export interface ItemProps {
  label: string;
  id: string;
}
interface Props {
  items: Array<ItemProps>;
  onSelect: (item: ItemProps) => void;
  selected?: ItemProps;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: DimensionValue;
  fullHeight?: DimensionValue;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
}

const Dropdown = (props: Props) => {
  const {
    items,
    onSelect,
    selected,
    placeholder = '옵션을 선택하세요.',
    disabled = false,
    fullWidth,
    fullHeight,
    fontSize,
    style,
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [option, setOption] = useState(selected ?? {label: '', id: ''});

  const handleSelect = (item: ItemProps) => {
    onSelect(item);
    setOption(item);
    setIsVisible(false);
  };

  useEffect(() => {
    selected && setOption(selected);
  }, [selected]);

  return (
    <Pressable
      style={[styles.container, style, {height: fullHeight ?? 42}]}
      disabled={disabled}
      onPress={() => setIsVisible(!isVisible)}>
      <View style={[styles.dropdownButton]}>
        {option.label.length > 0 ? (
          <CText text={option.label} fontSize={fontSize ?? 14} />
        ) : (
          <CText text={placeholder} color={COLORS.dark.gray} />
        )}
        <SvgIcon name="DownArrow" size={20} />
      </View>
      {isVisible && (
        <View style={[styles.optionsContainer, {top: fullHeight ?? 42}]}>
          {items.map((item, index) => (
            <TouchableOpacity
              style={styles.optionItem}
              key={Number(index)}
              onPress={() => handleSelect(item)}>
              <CText text={item.label} fontSize={fontSize ?? 14} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: COLORS.layout,
    zIndex: 3,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  optionsContainer: {
    zIndex: 3,
    position: 'absolute',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderWidth: 1,
    width: '100%',
    backgroundColor: 'white',
    borderColor: COLORS.layout,
    borderRadius: 7,
  },
  optionItem: {
    paddingVertical: 10,
  },
});

export default Dropdown;
