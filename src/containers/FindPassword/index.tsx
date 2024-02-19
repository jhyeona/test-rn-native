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
  const setGlobalModalState = useSetRecoilState(globalState.globalModalState);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isWarningPhone, setIsWarningPhone] = useState(false);
  const [isWarningName, setIsWarningName] = useState(false);
  const [isWarningBirthday, setIsWarningBirthday] = useState(false);

  const onPressFind = async () => {
    const isInvalidPhone = !phone || !checkPhone(phone);
    const isInvalidName = !name || !checkName(name);
    const isInvalidBirthday = !birthday || !checkDate(birthday);

    setIsWarningPhone(isInvalidPhone);
    setIsWarningName(isInvalidName);
    setIsWarningBirthday(isInvalidBirthday);

    if (isInvalidPhone || isInvalidName || isInvalidBirthday) {
      return;
    }

    const payload = {
      phone: phone,
      name: name,
      birth: birthday.substring(2),
    };

    try {
      await postFindPassword(payload);
      setGlobalModalState({
        isVisible: true,
        title: '안내',
        message:
          '임시 비밀번호를 전송하였습니다.\n임시 비밀번호로 로그인해주세요.',
      });
    } catch (e: any) {
      if (e.code === '4003') {
        setGlobalModalState({
          isVisible: true,
          title: '안내',
          message: '일치하는 정보가 없습니다.',
        });
        return;
      }
      if (e.code === '9100') {
        setGlobalModalState({
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
          isWarning={isWarningPhone}
          errorMessage="휴대폰 번호를 확인해 주세요."
          maxLength={11}
          inputMode="numeric"
        />
        <CInput
          title="성명"
          inputValue={name}
          setInputValue={setName}
          placeholder="홍길동"
          isWarning={isWarningName}
          errorMessage="이름을 확인해 주세요."
          inputMode="text"
        />
        <CInput
          title="생년월일"
          inputValue={birthday}
          setInputValue={setBirthday}
          inputMode="numeric"
          placeholder="YYYYMMDD"
          isWarning={isWarningBirthday}
          errorMessage="생년월일을 확인해 주세요."
          maxLength={8}
        />
        <CButton text="임시 비밀번호 발급" onPress={onPressFind} />
      </CView>
    </CSafeAreaView>
  );
};

export default FindPassword;
