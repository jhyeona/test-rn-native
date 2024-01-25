import React, {useState} from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors.ts';
import CText from '../CustomText/CText.tsx';

interface ItemProps {
  label: string;
  id: number;
}
interface Props {
  items: Array<ItemProps>;
  onSelect: (item: ItemProps) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Dropdown = (props: Props) => {
  const {
    items,
    onSelect,
    placeholder = '옵션을 선택하세요.',
    disabled = false,
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [option, setOption] = useState({label: '', id: -1});

  const handleSelect = (item: ItemProps) => {
    onSelect(item);
    setOption({label: item.label, id: item.id});
    setIsVisible(false);
  };

  return (
    <View style={{zIndex: 2}}>
      <View style={styles.container}>
        <TouchableOpacity
          disabled={disabled}
          style={styles.dropdownButton}
          onPress={() => setIsVisible(!isVisible)}>
          {option.label.length > 0 ? (
            <CText text={option.label} />
          ) : (
            <CText text={placeholder} color={COLORS.dark.gray} />
          )}
          <Text>{isVisible ? '🔺' : '🔻'}</Text>
        </TouchableOpacity>
      </View>
      {isVisible && (
        <View style={styles.optionsContainer}>
          {items.map(item => (
            <TouchableOpacity
              style={styles.optionItem}
              key={item.id}
              onPress={() => handleSelect(item)}>
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 15,
    width: '100%',
    height: 42,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: COLORS.layout,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionsContainer: {
    position: 'absolute',
    top: 42,
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
