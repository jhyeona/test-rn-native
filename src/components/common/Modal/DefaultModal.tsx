import React, {ReactNode, useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Modal, Pressable} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import CButton from '#components/common/CommonButton/CButton.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';

interface DefaultModalProps {
  isVisible: boolean;
  title?: string;
  onPressCancel?: (isVisible: boolean) => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

const DefaultModal = (props: DefaultModalProps) => {
  const {isVisible, title, onPressCancel, style, children} = props;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (onPressCancel) {
        onPressCancel(false);
      }
    });
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
          style={[
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 24,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            style,
          ]}>
          <View style={styles.modalBodyContainer}>
            {title && (
              <View style={styles.titleContainer}>
                <CText text={title} fontWeight="600" fontSize={20} />
                <Pressable onPress={closeModal}>
                  <SvgIcon name="Close" size={17} />
                </Pressable>
              </View>
            )}
            {children && <View style={{flex: 1, width: '100%'}}>{children}</View>}
          </View>
          <View style={styles.buttonContainer}>
            <CButton onPress={closeModal} text="닫기" noMargin />
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
  modalBodyContainer: {
    paddingTop: 20,
    paddingBottom: 35,
    paddingHorizontal: 25,
    width: '100%',
    height: '50%',
    backgroundColor: 'white',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
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

export default DefaultModal;
