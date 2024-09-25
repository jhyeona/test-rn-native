import {requestGet, requestPatch, requestPost} from '#apis/index.ts';
import instance from '#apis/instance.ts';
import {ApiResponseErrorProps} from '#types/common.ts';
import {
  ReqGetReasonDetails,
  ReqGetReasonList,
  ResGetReasonDetails,
  ResGetReasonList,
} from '#types/reason.ts';

export const requestGetReasonList = async (
  payload: ReqGetReasonList,
): Promise<ResGetReasonList> => {
  // 사유서 리스트
  const {academyId, lectureId, page, pageSize} = payload;

  const baseUrl = `/reason/list/academy/${academyId}`;
  const lecturePath = lectureId ? `/lecture/${lectureId}` : '';
  const url = `${baseUrl}${lecturePath}?page=${page}&pageSize=${pageSize}`;

  return requestGet(url);
};

export const requestGetReasonDetails = async (
  payload: ReqGetReasonDetails,
): Promise<ResGetReasonDetails> => {
  // 사유서 상세보기
  const {reasonId} = payload;
  const url = `/reason/${reasonId}`;
  return requestGet(url);
};

export const requestCreateReason = async (
  formData: FormData,
): Promise<ResGetReasonDetails> => {
  // 사유서 생성
  const url = `/reason/create`;
  return requestPost(url, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

export const requestUpdateReason = async (
  payload: FormData,
): Promise<ResGetReasonDetails> => {
  // 사유서 수정
  const url = `/reason/update`;
  return requestPatch(url, payload, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};
