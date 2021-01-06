// eslint-disable-next-line @typescript-eslint/ban-types
export const deepClone = (value: object): object => {
  return JSON.parse(JSON.stringify(value));
};
