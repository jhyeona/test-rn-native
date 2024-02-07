import React, {useState} from 'react';
import {View} from 'react-native';
import {checkDate, checkName, checkPhone} from '../../utils/regExpHelper.ts';
import CSafeAreaView from '../../components/common/CommonView/CSafeAreaView.tsx';
import CView from '../../components/common/CommonView/CView.tsx';
import Header from '../../components/common/Header/Header.tsx';
import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import CInput from '../../components/common/CustomInput/CInput.tsx';
import CButton from '../../components/common/CommonButton/CButton.tsx';
import {postFindPassword} from '../../hooks/useUser.ts';
import {useSetRecoilState} from 'recoil';
import globalState from '../../recoil/Global';

const FindPassword = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const setModalState = useSetRecoilState(globalState.globalModalState);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');

  const onPressFind = async () => {
    if (!phone || !checkPhone(phone)) {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '휴대폰 번호를 확인하세요.',
      });
      return;
    }
    if (!name || !checkName(name)) {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '이름을 확인하세요.',
      });
      return;
    }
    if (!birthday || !checkDate(birthday)) {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '생년월일을 확인하세요.',
      });
      return;
    }
    const payload = {
      phone: phone,
      name: name,
      birth: birthday.substring(2),
    };

    try {
      const response = await postFindPassword(payload);
      setModalState({
        isVisible: true,
        title: '안내',
        message:
          '임시 비밀번호를 전송하였습니다.\n임시 비밀번호로 로그인해주세요.',
      });
      console.log(response);
    } catch (e: any) {
      console.log(e);
      if (e.code === '4003') {
        setModalState({
          isVisible: true,
          title: '안내',
          message: '일치하는 정보가 없습니다.',
        });
        return;
      }
      if (e.code === '9100') {
        setModalState({
          isVisible: true,
          title: '안내',
          message:
            '메세지 전송에 실패했습니다. \n번호 확인 후 다시 시도해 주세요.',
        });
      }
      // 400: message: 해당하는 사용자가 없습니다.
      // 500: message: 메세지 전송이 실패했습니다. 번호 확인 후 다시 시도해 주세요. / description: SENS 서비스에 발송을 요청하였으나, 올바른 응답이 오지 않았습니다!
    }
  };

  return (
    <CSafeAreaView>
      <Header title="비밀번호 재발급" navigation={navigation} isBack />
      <CView>
        <View style={{marginTop: 20}} />
        <CInput
          title="휴대폰 번호"
          inputValue={phone}
          setInputValue={setPhone}
          placeholder="01012341234"
          maxLength={11}
          inputMode="numeric"
        />
        <CInput
          title="성명"
          inputValue={name}
          setInputValue={setName}
          placeholder="홍길동"
          inputMode="text"
        />
        <CInput
          title="생년월일"
          inputValue={birthday}
          setInputValue={setBirthday}
          inputMode="numeric"
          placeholder="YYYYMMDD"
          maxLength={8}
        />
        <CButton text="임시 비밀번호 발급" onPress={onPressFind} />
      </CView>
    </CSafeAreaView>
  );
};

export default FindPassword;
