import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes';

import {useRecoilState} from 'recoil';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CText from '#components/common/CustomText/CText';
import GlobalState from '#recoil/Global';

const GlobalModal = () => {
  const [modalState, setModalState] = useRecoilState(
    GlobalState.globalModalState,
  );
  const {isVisible, title, message, isConfirm, onPressConfirm, onPressCancel} =
    modalState;
  const [messageList, setMessageList] = useState<string[]>([]);
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
    // const {locationX, locationY} = event.nativeEvent;
    // if (
    //   // modal container 내
    //   locationX < 0 ||
    //   locationX > 0.8 * Dimensions.get('window').width ||
    //   locationY < 0 ||
    //   locationY > 200
    // ) {
    //   // modal container 외부 클릭 시
    //   closeModal();
    // }
  };

  const splitMessage = () => {
    const splitList = message.split('. ');
    return splitList.map((item, index) => {
      return index === splitList.length - 1 ? item : `${item}.`;
    });
  };

  useEffect(() => {
    if (isVisible) {
      // 메세지가 있을 경우 '.' 을 기준으로 잘라서 엔터 처리
      const messageSplit = message.split('. ');
      const splitList = messageSplit.map((item, index) =>
        index === messageSplit.length - 1 ? item : `${item}.`,
      );
      setMessageList(splitList);

      // 모달 애니메이션
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
                  {messageList.map((item, i) => (
                    // <p key={item} className="text-left text-gray-800">
                    //   {item}
                    // </p>
                    <CText
                      key={`modal-messages-${i}`}
                      text={item}
                      lineHeight={24}
                      fontSize={16}
                      lineBreak
                      style={{textAlign: 'center'}}
                    />
                  ))}
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
    padding: 10,
    alignItems: 'center',
  },
  messageText: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GlobalModal;
