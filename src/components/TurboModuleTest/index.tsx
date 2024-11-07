import {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, Button} from 'react-native';

import NativeBaseInfo from '../../specs/NativeBaseInfo.ts';

const EMPTY = '<empty>';

const TurboModuleTest = () => {
  const [value, setValue] = useState<string | null>(null);

  const [editingValue, setEditingValue] = useState<string | null>(null);

  useEffect(() => {
    const storedValue = NativeBaseInfo?.getItem('myKey');
    setValue(storedValue ?? '');
  }, []);

  function saveValue() {
    NativeBaseInfo?.setItem(editingValue ?? EMPTY, 'myKey');
    setValue(editingValue);
  }

  function clearAll() {
    NativeBaseInfo?.clear();
    setValue('');
  }

  function deleteValue() {
    NativeBaseInfo?.removeItem(editingValue ?? EMPTY);
    setValue('');
  }

  function testB() {
    const test = NativeBaseInfo?.getTelephoneInfo();
    console.log(' ------ CELL DATA ------  \n', test);
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.text}>Current stored value is: {value ?? 'No Value'}</Text>
      <TextInput
        placeholder="Enter the text you want to store"
        style={styles.textInput}
        onChangeText={setEditingValue}
      />
      <Button title="Save" onPress={saveValue} />
      <Button title="Delete" onPress={deleteValue} />
      <Button title="Clear" onPress={clearAll} />
      <Button title="B" onPress={testB} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 10,
    fontSize: 20,
  },
  textInput: {
    margin: 10,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
  },
});

export default TurboModuleTest;
