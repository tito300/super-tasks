import { storageService } from "@src/storage/storage.service";

export const commonHeaders: Record<string, any> = {};

/**
 * Wrapper around fetch that includes default headers
 */
export function fetcher(url: string, options: RequestInit = {}) {
  // Merge default headers with any headers provided in options
  const headers = new Headers(options.headers || {});
  Object.entries(commonHeaders).forEach(([key, value]) => {
    if (!headers.has(key)) {
      headers.append(key, value);
    }
  });

  // Merge the rest of the options from the original call with the new headers
  const newOptions = {
    ...options,
    headers,
  };

  return fetch(url, newOptions).then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response;
  });
}

fetcher.get = (url: string, options: RequestInit = {}) => {
  return fetcher(url, { method: "GET", ...options });
};

fetcher.post = (url: string, body: any, options: RequestInit = {}) => {
  return fetcher(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
};

fetcher.delete = (url: string, options: RequestInit = {}) => {
  return fetcher(url, {
    method: "DELETE",
    ...options,
  });
};

/**
 * only supports JSON response
 */
fetcher.getWithCache = async (
  url: string,
  {
    cacheKey,
    maxCacheAge,
    ...options
  }: RequestInit & { cacheKey?: string; maxCacheAge?: number }
) => {
  cacheKey = cacheKey || url;

  /**
   * At this low level service we don't want to have a long cache time
   * The point is to prevent multiple requests to the same endpoint in a short period of time
   * To optimize more, use cache at a higher level service (react query for instance)
   */
  maxCacheAge = maxCacheAge ?? 1000 * 30;

  const cachedData = await getCachedData(cacheKey, maxCacheAge);
  if (cachedData) {
    console.log("Returning cached data for ", cacheKey);
    return {
      json: async () => cachedData,
    };
  }

  console.log("Cache missed for ", cacheKey);
  const response = await fetcher.get(url, options);
  const jsonFunc = response.json.bind(response);
  response.json = async () => {
    const data = await jsonFunc();
    setCacheData(cacheKey, data);
    return data;
  };
  return response;
};

async function getCachedData(name: string, maxAge: number) {
  const data = await chrome.storage.local.get(`${name}Cache`);
  const cache = data[`${name}Cache`];
  if (cache && Date.now() - cache.setAt < maxAge) {
    return cache.data;
  }
  return null;
}

async function setCacheData(name: string, data: any) {
  storageService.set({
    cache: { [`${name}Cache`]: { data, updatedAt: Date.now() } },
  });
}
