import React, {useState} from 'react';
import {View} from 'react-native';

import {BottomTabNavigationHelpers} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CInput from '#components/common/CustomInput/CInput.tsx';
import Header from '#components/common/Header/Header.tsx';
import {useReqFindPassword} from '#containers/FindPassword/hooks/useApi.ts';
import {errorToCrashlytics, setAttToCrashlytics} from '#services/firebase.ts';
import {checkDate, checkName, checkPhone} from '#utils/regExpHelper.ts';

const FindPassword = ({
  navigation,
}: {
  navigation: BottomTabNavigationHelpers;
}) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isWarningPhone, setIsWarningPhone] = useState(false);
  const [isWarningName, setIsWarningName] = useState(false);
  const [isWarningBirthday, setIsWarningBirthday] = useState(false);

  const {findPassword} = useReqFindPassword();

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
      await findPassword(payload);
    } catch (e: any) {
      await setAttToCrashlytics(payload);
      errorToCrashlytics(e, 'SendSMSCodeForTempPassword');
    }
  };

  return (
    <CSafeAreaView>
      <Header title="비밀번호 재발급" navigation={navigation} isBack />
      <CView isInput>
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
          maxLength={5}
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
