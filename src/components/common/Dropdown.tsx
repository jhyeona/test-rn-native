import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {StyleSheet} from 'react-native';

interface Props {
  list: Array<{label: string; value: string}>;
  disabled: boolean;
  onChangeValue: any;
}
const Dropdown = (props: Props) => {
  const {list, disabled, onChangeValue} = props;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(list[0].value);
  const [items, setItems] = useState(list);

  return (
    <DropDownPicker
      style={styles.dropdown}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      onChangeValue={onChangeValue}
      placeholder="선택"
      disabled={disabled}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    // zIndex: 1,
  },
});
export default Dropdown;
