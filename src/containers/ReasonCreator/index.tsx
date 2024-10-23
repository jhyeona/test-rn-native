import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, TextInput, View} from 'react-native';

import {RouteProp} from '@react-navigation/core/src/types.tsx';
import {useRoute} from '@react-navigation/native';
import {NativeStackNavigationHelpers} from '@react-navigation/native-stack/lib/typescript/src/types';
import moment, {Moment} from 'moment';

import DatePicker from '#components/common/Calendar/DatePicker.tsx';
import CButton from '#components/common/CommonButton/CButton.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import CText from '#components/common/CustomText/CText.tsx';
import Dropdown, {ItemProps} from '#components/common/Dropdown/Dropdown.tsx';
import Header from '#components/common/Header/Header.tsx';
import StatusInfoContainer, {
  ColorType,
} from '#components/common/StatusInfoContainer';
import {COLORS} from '#constants/colors.ts';
import {MAX_FILE_SIZE, REQ_DATE_FORMAT} from '#constants/common.ts';
import {REASON_STATUS_MAP} from '#constants/reason.ts';
import {useGetLectureList} from '#containers/DailySchedules/hooks/useApi.ts';
import PhotoBox from '#containers/ReasonCreator/components/PhotoBox.tsx';
import {NavigateReasonProps} from '#containers/ReasonStatement';
import {
  useCreateReason,
  useGetReasonDetails,
  useUpdateReason,
} from '#containers/ReasonStatement/hooks/useApi.ts';
import {errorToCrashlytics, setAttToCrashlytics} from '#services/firebase.ts';

export interface ImgListProps {
  uri: string;
  isOriginal?: boolean;
  isDelete?: boolean;
  fileName?: string;
  fileSize?: number;
  height?: number;
  id?: string;
  timestamp?: string;
  type?: string;
  width?: number;
}

const ReasonCreator = ({
  navigation,
}: {
  navigation: NativeStackNavigationHelpers;
}) => {
  const route =
    useRoute<
      RouteProp<{ReasonCreator: NavigateReasonProps}, 'ReasonCreator'>
    >();
  const {isCreate, reasonId} = route.params;
  const {lectureItems} = useGetLectureList();

  const [disabled, setDisabled] = useState(false);
  const [text, setText] = useState<string>('');
  const [selectedData, setSelectedData] = useState<{
    lecture?: ItemProps;
    date: Moment;
  }>({date: moment()});
  const [imgList, setImgList] = useState<ImgListProps[]>([]);
  const [imgListLength, setImgListLength] = useState<number>(0);
  const [status, setStatus] = useState<{colorType: ColorType; text: string}>({
    colorType: 'gray',
    text: '미승인',
  });

  const {reasonDetails} = useGetReasonDetails({reasonId: reasonId ?? ''});
  const {createReason} = useCreateReason();
  const {updateReason} = useUpdateReason();

  const handleChangeLecture = (item: ItemProps) => {
    setSelectedData(prev => ({...prev, lecture: item}));
  };
  const handleChangeDate = (date: Moment) => {
    setSelectedData(prev => ({...prev, date}));
  };

  const handleCreate = async () => {
    const lectureId = selectedData?.lecture?.id ?? '';
    const date = selectedData.date.format(REQ_DATE_FORMAT);
    try {
      const formData = new FormData();
      const deletedImages: string[] = []; // 원래 있던 데이터 중 삭제할 데이터 목록
      imgList.forEach((img, i) => {
        // 첨부한 이미지 추가
        if (!img.isOriginal) {
          formData.append(`image0${i + 1}`, {
            uri: img.uri,
            name:
              img.fileName || `${moment().format('YYYY-MM-DD_HH:mm:ss')}.jpg`,
            type: img.type || 'image/jpeg',
          });
        } else if (img.isDelete) {
          deletedImages.push(img.uri);
        }
      });

      if (isCreate) {
        // 생성
        formData.append('lectureId', lectureId);
        formData.append('date', date);
        formData.append('content', text);
        await createReason(formData);
      } else {
        // 수정
        formData.append('reasonId', reasonId);
        formData.append('date', date);
        formData.append('content', text);
        if (deletedImages.length > 0) {
          formData.append('deletedImages', deletedImages.join(','));
        }
        await updateReason(formData);
      }
      navigation.navigate('ReasonStatement');
    } catch (error) {
      await setAttToCrashlytics({
        reasonId,
        lectureId,
      });
      errorToCrashlytics(
        error,
        isCreate ? 'requestCreateReason' : 'requestUpdateReason',
      );
    }
  };

  const onPressDeletePhoto = (uri: string) => {
    const filtered = imgList
      .filter(item => !(item.uri === uri && !item.isOriginal)) // 원래 데이터가 아니면 리스트에서 삭제
      .map(item =>
        item.uri === uri && item.isOriginal ? {...item, isDelete: true} : item,
      ); // 원래 데이터면 isDelete 값 추가
    setImgList(filtered);
  };

  useEffect(() => {
    if (reasonDetails) {
      const statusMapped = REASON_STATUS_MAP[reasonDetails.status];
      setDisabled(!isCreate && reasonDetails.status !== 'NONE');
      setStatus(statusMapped);
      setText(reasonDetails.content);

      const imgListData = reasonDetails.imagePathList.map(img => {
        console.log('imgURL: ', img);
        const imgUrl = img.replace('{aws.s3.bucket-name}', 'checkhere-dev');
        return {uri: imgUrl, isOriginal: true};
      });
      setImgList(imgListData);
    }

    // 기존에 선택된 강의가 있을 경우 자동 선택
    const selectedLecture = isCreate
      ? lectureItems[0]
      : lectureItems.filter(item => item.id === reasonDetails?.lectureId)?.[0];
    setSelectedData({
      lecture: selectedLecture,
      date: moment(reasonDetails?.date),
    });
  }, [reasonDetails, lectureItems]);

  useEffect(() => {
    // 총 이미지 개수 (삭제된건 포함하지 않음)
    setImgListLength(imgList?.filter(item => !item.isDelete).length ?? 0);
  }, [imgList]);

  const handleImgList = (assets: any) => {
    const isOverSize = assets.some(
      (item: {fileSize: number}) => item.fileSize > MAX_FILE_SIZE,
    );
    if (isOverSize) {
      Alert.alert(
        `이미지 1장당 크기는 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB 입니다.`,
      );
      return;
    }
    if (imgListLength + assets.length > 3) {
      Alert.alert('이미지는 최대 3장까지 첨부가능합니다.');
      return;
    }
    const result = assets.map((asset: any) => ({...asset, isOriginal: false}));
    setImgList(prev => [...prev, ...result]);
  };

  return (
    <CSafeAreaView>
      <Header
        title={`사유서 ${isCreate ? '작성' : disabled ? '확인' : '수정'}`}
        isBack
        navigation={navigation}
      />
      <CView>
        <ScrollView style={styles.container} bounces={false}>
          <Dropdown
            disabled={!isCreate || disabled}
            items={lectureItems}
            onSelect={handleChangeLecture}
            selected={selectedData.lecture ?? lectureItems[0]}
            placeholder="강의 선택"
          />
          <View style={styles.info}>
            <DatePicker
              handleDateSelection={handleChangeDate}
              disabled={disabled}
              defaultDate={reasonDetails?.date}
            />
            <View style={styles.row}>
              <StatusInfoContainer
                colorType={status.colorType}
                text={status.text}
              />
            </View>
          </View>
          <View style={[styles.textContainer, disabled && styles.textDisabled]}>
            <TextInput
              multiline
              scrollEnabled
              value={text}
              style={[
                styles.textArea,
                {color: disabled ? COLORS.placeholder : 'black'},
              ]}
              textAlignVertical="top"
              maxLength={500}
              onChangeText={setText}
              placeholder="사유서 내용을 입력하세요."
              placeholderTextColor={COLORS.placeholder}
              readOnly={disabled}
            />
            <View style={styles.verticalLine}>
              <CText
                text={`${text.length}/500`}
                style={{textAlign: 'right'}}
                color={COLORS.placeholder}
              />
            </View>
          </View>
          <View style={styles.row}>
            <CText text="사진" />
            <CText text={` (${imgListLength}/3)`} color={COLORS.placeholder} />
          </View>
          <View style={[styles.row, styles.photoContainer]}>
            <PhotoBox
              handleImgList={handleImgList}
              isDefault
              disabled={disabled || imgListLength === 3}
            />
            {imgList.map(item => {
              if (!item.isDelete) {
                return (
                  <PhotoBox
                    disabled={disabled}
                    key={`reason-image-${item.id ?? moment()}-${item.uri}`}
                    onPressDelete={() => onPressDeletePhoto(item.uri)}
                    source={item.uri}
                  />
                );
              }
            })}
          </View>
          {(isCreate || !disabled) && (
            <CButton
              text="저장하기"
              onPress={handleCreate}
              disabled={!selectedData.lecture || !text}
            />
          )}
        </ScrollView>
      </CView>
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  info: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginVertical: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.layout,
    borderRadius: 7,
  },
  textDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  verticalLine: {
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: COLORS.layout,
  },
  textArea: {
    minHeight: 250,
  },
  photoContainer: {
    marginVertical: 10,
    gap: 6,
  },
});

export default ReasonCreator;
