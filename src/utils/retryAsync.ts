import { wait } from "./wait";

export function retryAsync<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  return fn().catch(async (err) => {
    if (retries <= 0) throw err;

    await wait(500);
    return retryAsync(fn, retries - 1);
  });
}
