import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

interface Props {
  list: Array<{label: string; value: string}>;
  setDropDownList: any;
}
const Dropdown = (props: Props) => {
  const {list, setDropDownList} = props;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(list[0].value);
  const [items, setItems] = useState(list);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder="기관 선택"
    />
  );
};

export default Dropdown;
