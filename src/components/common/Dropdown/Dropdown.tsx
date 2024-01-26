import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import {COLORS} from '../../../constants/colors.ts';
import CText from '../CustomText/CText.tsx';
import {DimensionValue} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import SvgIcon from '../../../components/common/Icon/Icon.tsx';
import {DownArrow} from '../../../assets/svg';

interface ItemProps {
  label: string;
  id: string;
}
interface Props {
  items: Array<ItemProps>;
  onSelect: (item: ItemProps) => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: DimensionValue;
  fullHeight?: DimensionValue;
  fontSize?: number;
}

const Dropdown = (props: Props) => {
  const {
    items,
    onSelect,
    placeholder = '옵션을 선택하세요.',
    disabled = false,
    fullWidth,
    fullHeight,
    fontSize,
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [option, setOption] = useState({label: '', id: ''});

  const handleSelect = (item: ItemProps) => {
    onSelect(item);
    setOption(item);
    setIsVisible(false);
  };

  return (
    <Pressable
      style={[
        styles.container,
        {width: fullWidth ?? '100%', height: fullHeight ?? 42},
      ]}
      disabled={disabled}
      onPress={() => setIsVisible(!isVisible)}>
      <View style={styles.dropdownButton}>
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
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: COLORS.layout,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsContainer: {
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
    paddingVertical: 6,
  },
});

export default Dropdown;
