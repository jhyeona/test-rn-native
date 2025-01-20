export const areAllValuesTrue = (obj: Record<any, boolean>) => {
  return Object.values(obj).every(v => v);
};
