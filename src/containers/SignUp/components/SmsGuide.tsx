import React from 'react';

import TextList from '#components/common/TextList/TextList.tsx';

const textList = [
  '메세지 보내기 버튼을 누르세요.',
  '메세지 보내기 창이 열리면 인증 메세지가 자동으로 입력됩니다.',
  '인증 메세지를 수정 없이 그대로 보내주세요. 발신번호가 휴대폰 본인확인에 이용됩니다.',
  '안전한 금융서비스를 위해 전화번호가 등록된 기기에서만 인증하실 수 있습니다.',
  '이용중인 통신 요금제에 따라 문자메세지 발송 비용이 발생할 수 있습니다.',
];

const SmsGuide = () => {
  return <TextList textList={textList} style={{width: '100%', marginVertical: 15}} />;
};

export default SmsGuide;
