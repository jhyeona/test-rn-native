export type DeepCopy<T> = {
  [K in keyof T]: T[K] extends object ? DeepCopy<T[K]> : T[K];
};

export const deepCopy = <T extends object>(obj: T): DeepCopy<T> => {
  const result: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // @ts-ignore
        result[key] = deepCopy(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
};
