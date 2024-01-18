import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import DatePicker from '../../components/common/DatePicker.tsx';
import moment from 'moment';
import {checkName, checkPhone} from '../../utils/regExpHelper.ts';
import {requestPostFindPassword} from '../../apis/user.ts';

const FindPassword = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSetBirthday = (pickerDate: string) => {
    setBirthday(moment(pickerDate).format('YYMMDD'));
  };

  const onPressFind = async () => {
    if (!phone || !checkPhone(phone)) {
      Alert.alert('휴대폰 번호를 확인하세요.');
      return;
    }
    if (!name || !checkName(name)) {
      Alert.alert('이름을 확인하세요.');
      return;
    }
    if (!birthday) {
      Alert.alert('생일을 입력하세요.');
      return;
    }
    const args = {
      data: {
        phone: phone,
        name: name,
        birth: birthday,
      },
    };
    try {
      await requestPostFindPassword(args);
    } catch (e) {
      // 400: message: 해당하는 사용자가 없습니다.
      // 500: message: 메세지 전송이 실패했습니다. 번호 확인 후 다시 시도해 주세요. / description: SENS 서비스에 발송을 요청하였으나, 올바른 응답이 오지 않았습니다!
    }
  };

  return (
    <SafeAreaView style={{height: '100%', alignItems: 'center'}}>
      <Text>비밀번호 찾기</Text>
      <TextInput
        placeholder="아이디(휴대폰 번호)를 입력하세요."
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        placeholder="이름를 입력하세요."
        value={name}
        onChangeText={setName}
      />
      <DatePicker handleSetDate={handleSetBirthday} />
      <TouchableOpacity
        onPress={onPressFind}
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
