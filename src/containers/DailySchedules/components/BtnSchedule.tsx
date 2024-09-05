import {StyleSheet, View} from 'react-native';

import CButton from '#components/common/CommonButton/CButton.tsx';

const BUTTON_HEIGHT = 28;
const BtnSchedule: React.FC = () => {
  const onPressEnter = () => {
    console.log('출석체크');
  };

  const onPressLeave = () => {
    console.log('외출시작');
  };

  const onPressComeback = () => {
    console.log('외출종료');
  };

  return (
    <>
      <CButton
        text="출석체크"
        onPress={onPressEnter}
        buttonStyle={{height: BUTTON_HEIGHT}}
        fontSize={12}
        noMargin
      />
      <View style={styles.leaveButtons}>
        <CButton
          text="외출시작"
          onPress={onPressLeave}
          buttonStyle={styles.leaveButton}
          fontSize={12}
          noMargin
        />
        <CButton
          text="외출종료"
          onPress={onPressComeback}
          buttonStyle={styles.leaveButton}
          fontSize={12}
          noMargin
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  leaveButtons: {
    gap: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leaveButton: {
    flex: 0.5,
    height: BUTTON_HEIGHT,
  },
});
export default BtnSchedule;
