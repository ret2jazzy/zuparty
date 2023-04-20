
export const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch((process.env.NEXT_PUBLIC_ZUPOLL_SERVER_URL || '') + input, init).then((res) => res.json());