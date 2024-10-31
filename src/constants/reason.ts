import {ColorType} from '#components/common/StatusInfoContainer';

export const REASON_STATUS_MAP: Record<string, {colorType: ColorType; text: string}> = {
  NONE: {colorType: 'gray', text: '미확인'},
  APPROVE: {colorType: 'blue', text: '확인'},
  REJECT: {colorType: 'red', text: '반려'},
};
