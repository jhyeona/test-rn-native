import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import {useQueryClient} from '@tanstack/react-query';
import moment from 'moment';
import {useSetRecoilState} from 'recoil';

import CheckboxCircle from '#components/common/Checkbox/CheckboxCircle.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';
import {handleLogout} from '#containers/Settings/utils/logoutHelper.ts';
import {usePreviousScreenName} from '#hooks/useNavigation.ts';
import {
  postJoinAcademy,
  useGetInvitedList,
  useGetUserInfo,
} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';
import userState from '#recoil/User';

interface CheckboxStateProps {
  isChecked: boolean;
  id: string;
  type: string;
  time: string;
  academy: {
    academyId: string;
    name: string;
    picture?: string | null;
  };
}

const Academy = ({navigation}: {navigation: NativeStackNavigationHelpers}) => {
  const queryClient = useQueryClient();
  const prevScreenName = usePreviousScreenName(navigation);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);
  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);
  const setUserData = useSetRecoilState(userState.userInfoState);

  const {data: invitedList, refetch: invitedRefetch} = useGetInvitedList();
  const {refetchUserData} = useGetUserInfo();

  const [checkboxState, setCheckboxState] = useState<CheckboxStateProps[]>([]);

  const handleCheckboxChange = (id: string) => {
    setCheckboxState(
      prevState =>
        prevState?.map(item =>
          item.academy.academyId === id
            ? {...item, isChecked: !item.isChecked}
            : item,
        ),
    );
  };

  const onPressSelectAcademy = async () => {
    const checkedList = checkboxState?.filter(value => {
      return value.isChecked;
    });
    const payload = {
      inviteIdList: checkedList
        ? checkedList?.map(val => {
            return val.id;
          })
        : [],
    };

    if (payload.inviteIdList.length === 0) {
      setModalState({
        isVisible: true,
        title: '안내',
        message: '기관을 선택하세요.',
      });
      return;
    }
    try {
      await postJoinAcademy(payload);
      await invitedRefetch();
      await refetchUserData();
      await queryClient.invalidateQueries({queryKey: ['userInfo']});
      setModalState({
        isVisible: true,
        title: '안내',
        message: '선택한 기관이 추가되었습니다.',
      });
    } catch (e: any) {
      console.log('Error:', e);
    }
  };

  useEffect(() => {
    if (invitedList) {
      setCheckboxState(() => {
        return invitedList.invitedList.map(item => ({
          ...item,
          isChecked: false,
        }));
      });
    }
  }, [invitedList]);

  return (
    <CSafeAreaView edges={['top', 'bottom']}>
      <Header
        title="가입기관 선택"
        isBack={!!prevScreenName}
        navigation={navigation}
      />
      <CView>
        {checkboxState && checkboxState.length > 0 ? (
          <>
            <CText
              text={`나를 초대한 기관이에요.\n가입하실 기관을 선택해 주세요. (중복 선택이 가능해요)`}
              fontWeight="600"
              lineHeight={22.4}
            />
            <ScrollView style={{marginTop: 30}}>
              {checkboxState.map((val, index) => {
                return (
                  <View
                    style={[
                      styles.checkContainer,
                      val.isChecked && styles.isCheckedContainer,
                    ]}
                    key={index}>
                    <CheckboxCircle
                      isChecked={val.isChecked}
                      onValueChangeHandler={() =>
                        handleCheckboxChange(val.academy.academyId)
                      }
                      labelMessage={`${val.academy.name} / ${moment(
                        val.time,
                      ).format('YYYY-MM-DD')}`}
                      fontSize={16}
                    />
                  </View>
                );
              })}
            </ScrollView>
            <CButton
              text="선택하기"
              onPress={onPressSelectAcademy}
              buttonStyle={{
                alignSelf: 'center',
                position: 'absolute',
                bottom: 0,
              }}
            />
          </>
        ) : (
          <>
            <View style={{flex: 1}}>
              <CText
                text="초대 받은 기관이 없어요."
                fontSize={16}
                fontWeight="600"
                style={{marginVertical: 20}}
              />
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <SvgIcon name="Invite" />
              </View>
            </View>
            {!prevScreenName && (
              <CButton
                text="로그아웃"
                onPress={() =>
                  handleLogout({setGlobalModalState, setUserData, setIsLogin})
                }
              />
            )}
          </>
        )}
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  checkContainer: {
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: COLORS.layout,
    borderRadius: 7,
  },
  isCheckedContainer: {
    backgroundColor: COLORS.light.blue,
    borderColor: COLORS.primary,
  },
});

export default Academy;
