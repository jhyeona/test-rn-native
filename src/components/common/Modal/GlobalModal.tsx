import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {useRecoilState} from 'recoil';
import globalState from '../../../recoil/Global';
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import CText from '../CustomText/CText';
import CButton from '../CommonButton/CButton.tsx';

const GlobalModal = () => {
  const [modalState, setModalState] = useRecoilState(
    globalState.globalModalState,
  );
  const {isVisible, title, message, isConfirm, onPressConfirm, onPressCancel} =
    modalState;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const initModal = {
    isVisible: false,
    title: '',
    message: '',
    isConfirm: false,
    onPressConfirm: () => {},
    onPressCancel: () => {},
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setModalState(initModal));
  };

  const handleConfirm = () => {
    if (onPressConfirm) {
      onPressConfirm();
    }
    setModalState(initModal);
    closeModal();
  };

  const handleCancel = () => {
    if (onPressCancel) {
      onPressCancel();
    }
    setModalState(initModal);
    closeModal();
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
      {isVisible && (
        <TouchableWithoutFeedback onPress={handleContainerPress}>
          <View style={styles.container}>
            <Animated.View style={[styles.modalContainer, {opacity: fadeAnim}]}>
              <View style={styles.modalContent}>
                <CText
                  text={title}
                  fontSize={18}
                  fontWeight="700"
                  style={styles.titleText}
                />
                <View style={styles.messageText}>
                  <CText
                    text={message}
                    lineHeight={24}
                    fontSize={16}
                    style={{textAlign: 'center'}}
                  />
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <CButton
                  text="확인"
                  onPress={handleConfirm}
                  noMargin
                  buttonStyle={{flex: 1}}
                />
                {isConfirm && (
                  <CButton
                    text="취소"
                    onPress={handleCancel}
                    noMargin
                    whiteButton
                    buttonStyle={{flex: 1, marginLeft: 10}}
                  />
                )}
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    minHeight: 200,
    backgroundColor: 'white',
    borderRadius: 7,
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

export default GlobalModal;
