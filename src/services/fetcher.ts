import { storageService } from "@src/storage/storage.service";
import axios from "axios";

const commonHeaders: Record<string, any> = {};

export const setupJwtToken = (token?: string | null) => {
  commonHeaders["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const getCommonHeaders = () => commonHeaders;

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

type Timestamp = number;
const cache: Record<
  string,
  {
    timestamp: Timestamp;
    data: any;
    response: Response;
  }
> = {};

fetcher.get = async (url: string, options: RequestInit = {}) => {
  if (cache[url] && Date.now() - cache[url].timestamp < 1000 * 10) {
    console.log("Using cache for", url);
    const response = cache[url].response;
    response.json = async () => cache[url].data;
    return Promise.resolve(response);
  }

  const response = await fetcher(url, { method: "GET", ...options });
  const data = await response.json();
  cache[url] = {
    timestamp: Date.now(),
    data,
    response,
  };
  cleanupCache();
  return response;
};

function cleanupCache() {
  const now = Date.now();
  Object.keys(cache).forEach((key) => {
    if (now - cache[key].timestamp > 1000 * 60) {
      delete cache[key];
    }
  });
}

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
  }: RequestInit & {
    cacheKey: string;
    maxCacheAge?: number;
    skipCache?: boolean;
  }
) => {
  cacheKey = cacheKey || url;

  /**
   * At this low level service we don't want to have a long cache time
   * The point is to prevent multiple requests to the same endpoint in a short period of time
   * To optimize more, use cache at a higher level service (react query for instance)
   */
  maxCacheAge = maxCacheAge ?? 0;

  const cachedData = await getCachedData(cacheKey, maxCacheAge);
  if (cachedData) {
    return {
      json: async () => cachedData,
    };
  }

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
  const data = await storageService.get(`fetcherCache`);
  const cache = data.fetcherCache?.[name];
  if (cache && Date.now() - cache.updatedAt < maxAge) {
    return cache.data;
  }
  return null;
}

async function setCacheData(name: string, data: any) {
  storageService.set({
    fetcherCache: { [name]: { data, updatedAt: Date.now() } },
  });
}
