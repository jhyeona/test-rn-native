export interface ReqGetReasonList {
  academyId: string;
  lectureId?: string;
  page: number;
  pageSize: number;
}

export interface ResGetReasonList {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: Array<ResGetReasonDetails>;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  empty: boolean;
}

export interface ReqGetReasonDetails {
  reasonId: string;
}

export type ReasonStatusType = 'APPROVE' | 'REJECT' | 'NONE';
export interface ResGetReasonDetails {
  sequence: number;
  reasonId: string;
  attendeeId: string;
  lectureId: string;
  lectureName: string;
  content: string;
  imagePathList: string[];
  // YYYY-MM-DD
  date: string;
  status: ReasonStatusType | string;
  // YYYY-MM-DDTHH:mm:ss
  time_confirm?: string;
}

/** 사유서 생성 시 FormData 에 들어가야할 데이터 */
export interface ReqCreateReason {
  lectureId: string;
  attendeeId: string;
  // YYYYMMDD
  date: string;
  content: string;
  image01?: File;
  image02?: File;
  image03?: File;
}

/** 사유서 수정 시 FormData 에 들어가야할 데이터 */
export interface ReqUpdateReason {
  reasonId: string;
  // YYYYMMDD
  date: string;
  content: string;
  deletedImages?: string;
  image01?: File;
  image02?: File;
  image03?: File;
}
