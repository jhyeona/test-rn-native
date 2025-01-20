import {Image, StyleSheet, View} from 'react-native';
import Config from 'react-native-config';

import CButton from '#components/common/CommonButton/CButton.tsx';
import {CustomScrollView} from '#components/common/CustomScrollComponents';
import CText from '#components/common/CustomText/CText.tsx';
import NumberingText from '#containers/SignUp/components/NumberingText.tsx';
import {openSMS} from '#containers/SignUp/utils/linkingHelper.ts';
import {useChangeWidth} from '#hooks/useGlobal.ts';
import {SignUpDataProps} from '#types/signup.ts';

const informationList = [
  '[동의 및 휴대폰번호 확인] 버튼을 누르세요.',
  '메세지 보내기 창에 번호 확인을 위한 인증 메세지가 자동으로 입력됩니다.',
  '인증 메세지를 수정 없이 그대로 보내주세요. 발신번호가 휴대폰 본인확인에 이용됩니다.',
];

const billInfo = '*이용중인 통신 요금제에 따라 문자메세지 발송 비용이 발생할 수 있습니다.';

const SignUpUserPhone = ({signUpData}: {signUpData: SignUpDataProps}) => {
  const width = useChangeWidth();

  const onPressOpenSms = () => {
    openSMS(Config.SMS_PHONE, signUpData?.code ?? '[문제가 발생하였습니다.] 다시 시도해주세요.');
  };

  return (
    <View style={{width: width}}>
      <CustomScrollView>
        <CText
          text="휴대폰 본인확인을 진행하세요."
          fontSize={20}
          fontWeight="700"
          style={{marginBottom: 25}}
        />
        <View style={{gap: 15}}>
          {informationList.map((val, i) => {
            return <NumberingText key={`signup-info-text-${i}`} index={i + 1} text={val} />;
          })}
        </View>
        <Image source={require('src/assets/img/signup.png')} style={styles.image} />
        <CText text={billInfo} fontWeight="300" />
      </CustomScrollView>
      <CButton text="동의 및 휴대폰번호 확인" onPress={onPressOpenSms} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    marginTop: 40,
    marginBottom: 20,
    alignSelf: 'center',
  },
});

export default SignUpUserPhone;
