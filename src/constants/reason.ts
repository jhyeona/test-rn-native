import {ColorType} from '#components/common/StatusInfoContainer';

export const REASON_STATUS_MAP: Record<
  string,
  {colorType: ColorType; text: string}
> = {
  NONE: {colorType: 'gray', text: '미승인'},
  APPROVE: {colorType: 'blue', text: '승인'},
  REJECT: {colorType: 'red', text: '반려'},
};
