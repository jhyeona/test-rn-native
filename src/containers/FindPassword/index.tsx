import React, {useState} from 'react';
import {SafeAreaView, Text, TextInput, TouchableOpacity} from 'react-native';

const FindPassword = () => {
  const [phone, setPhone] = useState('');
  return (
    <SafeAreaView style={{height: '100%', alignItems: 'center'}}>
      <Text>비밀번호 찾기</Text>
      <TextInput
        placeholder="아이디(휴대폰 번호)를 입력하세요."
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'black',
          width: '50%',
          padding: 10,
          alignItems: 'center',
        }}>
        <Text style={{color: 'white'}}>찾기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FindPassword;
