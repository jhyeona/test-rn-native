import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import moment from 'moment/moment';
import {useSetRecoilState} from 'recoil';

import CheckboxCircle from '#components/common/Checkbox/CheckboxCircle.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import {CustomScrollView} from '#components/common/CustomScrollComponents';
import {createRefreshControl} from '#components/common/CustomScrollComponents/utils/refreshContorlHelper.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import {COLORS} from '#constants/colors.ts';
import {DATE_FORMAT_DOT} from '#constants/common.ts';
import {useJoinAcademy} from '#containers/Academy/hooks/useApi.ts';
import {AcademyListProps, CheckboxStateProps} from '#containers/Academy/types';
import {useGetUserInfo} from '#hooks/useUser.ts';
import GlobalState from '#recoil/Global';

const AcademyList = ({
  refetch: invitedRefetch,
  invitedList,
  prevScreenName,
  navigation,
  isLoading,
}: AcademyListProps) => {
  const setModalState = useSetRecoilState(GlobalState.globalModalState);

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

  const refreshControl = createRefreshControl({
    refreshing: isLoading,
    onRefresh: invitedRefetch,
  });

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
    <View style={{flex: 1}}>
      <CustomScrollView refreshControl={refreshControl}>
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
    </View>
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
});

export default AcademyList;
