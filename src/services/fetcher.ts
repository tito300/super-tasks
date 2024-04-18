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
  console.log("headers", headers);

  // Merge the rest of the options from the original call with the new headers
  const newOptions = {
    ...options,
    headers,
  };

  return fetch(url, newOptions).then(response => {
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
