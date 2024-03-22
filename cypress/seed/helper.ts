const sleep = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

const retry = async <T>(
  func: () => Promise<T>,
  condition: (res: T) => boolean,
  maxAttempts = 30,
  delay = 1000,
) => {
  let i = 0;
  for (i; i < maxAttempts; i++) {
    console.log('attempt', i + 1, ' at running script');
    const response = await func();
    if (condition(response)) return response;
    if (i < maxAttempts - 1) await sleep(delay);
  }
  console.log(
    'Could not get good response from script in ',
    +maxAttempts + ' number of attempts',
  );
  throw new Error('Finished retrying attempts without passing condition');
};

export { retry };
