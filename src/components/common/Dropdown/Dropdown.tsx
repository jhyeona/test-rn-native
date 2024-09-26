import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
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
  height?: number;
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
    height,
    fontSize,
    style,
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [option, setOption] = useState(selected ?? {label: '', id: ''});

  const handleSelect = (item: ItemProps) => {
    onSelect(item);
    setOption(item);
    setIsVisible(false);
  };

  useEffect(() => {
    selected && setOption(selected);
  }, [selected]);

  useEffect(() => {
    setIsDisabled(items.length <= 1 || disabled);
  }, [items, disabled]);

  return (
    <>
      <Pressable
        style={[
          styles.container,
          style,
          {
            height: height ?? 42,
            backgroundColor: isDisabled ? COLORS.lightGray : 'white',
          },
        ]}
        disabled={isDisabled}
        onPress={() => setIsVisible(!isVisible)}>
        <View style={[styles.dropdownButton]}>
          {option?.label?.length ? (
            <CText
              text={option.label}
              fontSize={fontSize ?? 14}
              color={isDisabled ? COLORS.placeholder : 'black'}
            />
          ) : (
            <CText text={placeholder} color={COLORS.placeholder} />
          )}
          <SvgIcon name="DownArrow" size={20} />
        </View>
      </Pressable>
      {isVisible && (
        <ScrollView
          contentContainerStyle={styles.optionsContentContainer}
          style={[styles.optionsContainer, {top: height ? height + 3 : 45}]}>
          {items.map((item, index) => (
            <TouchableOpacity
              style={styles.optionItem}
              key={Number(index)}
              onPress={() => handleSelect(item)}>
              <CText text={item.label} fontSize={fontSize ?? 14} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 7,
    borderColor: COLORS.layout,
    zIndex: 99,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  optionsContainer: {
    zIndex: 99,
    alignSelf: 'center',
    position: 'absolute',
    paddingHorizontal: 15,
    borderWidth: 1,
    width: '100%',
    maxHeight: 400,
    backgroundColor: 'white',
    borderColor: COLORS.layout,
    borderRadius: 7,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6, // = boxShadow
      },
    }),
  },
  optionsContentContainer: {
    paddingVertical: 15,
  },
  optionItem: {
    paddingVertical: 10,
  },
});

export default Dropdown;
