export const wait = (ms: number = 1000, reject?: boolean) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (reject) return rej("failed");

      res("ok");
    }, ms);
  });
};
