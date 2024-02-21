export const makeRequestWithRetry = (
  method,
  url,
  apiKey,
  retryCount = 0,
  maxRetries = 10,
) => {
  return cy
    .request({
      method,
      url,
      headers: {
        "x-api-key": apiKey,
      },
      retryOnStatusCodeFailure: true,
    })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } else if (retryCount < maxRetries) {
        console.log(
          `Retrying request ${method} ${url} with apiKey ${apiKey} - retryCount: ${retryCount}`,
        );
        return makeRequestWithRetry(url, apiKey, retryCount + 1, maxRetries);
      } else {
        return response;
      }
    });
};
