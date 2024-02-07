import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Dimensions, Modal} from 'react-native';
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import CText from '../CustomText/CText';
import CButton from '../CommonButton/CButton.tsx';
import {COLORS} from '../../../constants/colors.ts';

interface CommonModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onPressConfirm: () => void;
  onPressCancel: () => void;
}

const CommonConfirmModal = (props: CommonModalProps) => {
  const {isVisible, title, message, onPressConfirm, onPressCancel} = props;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const confirmModal = () => {
    onPressConfirm();
    closeModal();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(onPressCancel);
  };

  const handleContainerPress = (event: GestureResponderEvent) => {
    const {locationX, locationY} = event.nativeEvent;
    if (
      // modal container 내
      locationX < 0 ||
      locationX > 0.8 * Dimensions.get('window').width ||
      locationY < 0 ||
      locationY > 200
    ) {
      // modal container 외부 클릭 시
      closeModal();
    }
  };

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible, fadeAnim]);
  return (
    <>
      <Modal visible={isVisible} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,

            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
          <View
            style={{
              width: '100%',
              height: 250,
              backgroundColor: 'white',
              borderRadius: 7,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <CText
              text={title}
              fontWeight="700"
              fontSize={18}
              style={{paddingVertical: 10}}
            />
            <CText text={message} style={{paddingVertical: 15}} />
            <View style={styles.buttonContainer}>
              <CButton
                onPress={confirmModal}
                text="확인"
                noMargin
                buttonStyle={{flex: 1, marginRight: 5}}
              />
              <CButton
                onPress={closeModal}
                text="취소"
                noMargin
                whiteButton
                buttonStyle={{flex: 1, marginLeft: 5}}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    minHeight: 200,
    backgroundColor: 'white',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.layout,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  titleText: {
    textAlign: 'center',
    marginBottom: 15,
  },
  modalContent: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  messageText: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommonConfirmModal;
