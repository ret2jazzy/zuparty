
export const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch((process.env.ZUPARTY_SERVER_URL || 'http://zuzalu.party:420') + input, init).then((res) => res.json());