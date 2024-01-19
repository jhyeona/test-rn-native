import React, {useEffect, useState} from 'react';
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

  useEffect(() => {
    setValue(list[0].value);
  }, [list]);

  return (
    <DropDownPicker
      style={styles.dropdown}
      open={open}
      value={value}
      items={list}
      setOpen={setOpen}
      setValue={setValue}
      onChangeValue={onChangeValue}
      placeholder="선택"
      disabled={disabled}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: 'grey',
    borderWidth: 0,
    marginBottom: 10,
  },
});
export default Dropdown;
