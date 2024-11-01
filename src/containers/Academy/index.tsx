import React, {useEffect, useState} from 'react';
import {RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';

import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import moment from 'moment';
import {useSetRecoilState} from 'recoil';

import CheckboxCircle from '#components/common/Checkbox/CheckboxCircle.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import {CustomScrollView} from '#components/common/CustomScrollComponents';
import CText from '#components/common/CustomText/CText.tsx';
import Header from '#components/common/Header/Header.tsx';
import SvgIcon from '#components/common/Icon/Icon.tsx';
import {COLORS} from '#constants/colors.ts';
import {DATE_FORMAT_DOT} from '#constants/common.ts';
import {useGetInvitedList, useJoinAcademy} from '#containers/Academy/hooks/useApi.ts';
import {handleLogout} from '#containers/Settings/utils/logoutHelper.ts';
import {usePreviousScreenName} from '#hooks/useNavigation.ts';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';

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
  const prevScreenName = usePreviousScreenName(navigation);
  const setModalState = useSetRecoilState(GlobalState.globalModalState);
  const setGlobalModalState = useSetRecoilState(GlobalState.globalModalState);
  const setIsLogin = useSetRecoilState(GlobalState.isLoginState);

  const {data: invitedList, refetch: invitedRefetch, isLoading} = useGetInvitedList();

  const {joinAcademy} = useJoinAcademy();
  const {refetchUserData} = useGetUserInfo();

  const [checkboxState, setCheckboxState] = useState<CheckboxStateProps[]>([]);

  const handleCheckboxChange = (id: string) => {
    setCheckboxState(prevState =>
      prevState?.map(item =>
        item.academy.academyId === id ? {...item, isChecked: !item.isChecked} : item,
      ),
    );
  };

  const onPressSelectAcademy = async () => {
    const checkedList = checkboxState?.filter(value => {
      return value.isChecked;
    });
    const payload = {
      inviteIdList: checkedList ? checkedList?.map(val => val.id) : [],
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
      await joinAcademy(payload);
      await invitedRefetch();
      await refetchUserData();

      if (prevScreenName) {
        navigation.goBack();
      }
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
      <Header title="기관 추가" isBack={!!prevScreenName} navigation={navigation} />
      <CView>
        {checkboxState && checkboxState.length > 0 ? (
          <>
            <CustomScrollView
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={() => {
                    invitedRefetch().then();
                  }}
                />
              }>
              <CText
                text={`나를 초대한 기관이에요.\n가입하실 기관을 선택해 주세요. (중복 선택이 가능해요)`}
                fontWeight="600"
                lineHeight={22.4}
              />
              {checkboxState.map((val, index) => {
                const academyName = `${val.academy.name}${val.type === 'TEACHER' ? ' (강사)' : ''}`;
                return (
                  <View
                    style={[styles.checkContainer, val.isChecked && styles.isCheckedContainer]}
                    key={index}>
                    <CheckboxCircle
                      circleSize={16}
                      isChecked={val.isChecked}
                      onValueChangeHandler={() => handleCheckboxChange(val.academy.academyId)}>
                      <View style={styles.academyItem}>
                        <CText
                          numberOfLines={2}
                          text={academyName}
                          style={styles.academyName}
                          lineBreak
                        />
                        <CText text={moment(val.time).format(DATE_FORMAT_DOT)} />
                      </View>
                    </CheckboxCircle>
                  </View>
                );
              })}
            </CustomScrollView>
            <CButton
              text="추가하기"
              disabled={!checkboxState.some(item => item.isChecked)}
              onPress={onPressSelectAcademy}
            />
          </>
        ) : (
          <View style={{flex: 1}}>
            <CText text="초대 받은 기관이 없어요." fontSize={16} fontWeight="600" />
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <SvgIcon name="Invite" />
            </View>
            <TouchableOpacity
              onPress={() => {
                invitedRefetch().then();
              }}>
              <CText color={COLORS.primary} text="새로고침하기" style={styles.refreshText} />
            </TouchableOpacity>
            {!prevScreenName && (
              <CButton
                whiteButton
                buttonStyle={{marginTop: 0}}
                text="로그아웃"
                onPress={() => handleLogout({setGlobalModalState, setIsLogin})}
              />
            )}
          </View>
        )}
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  checkContainer: {
    marginVertical: 14,
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
  academyItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  academyName: {
    flex: 1,
    marginHorizontal: 10,
  },
  refreshText: {
    marginVertical: 50,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default Academy;
