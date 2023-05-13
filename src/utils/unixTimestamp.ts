export const getUnixTimestamp = (date?: Date) =>
  Math.floor((date?.getTime() || Date.now()) / 1000);
