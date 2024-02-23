const sleep = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

const retry = async (
  func: any,
  condition: any,
  maxAttempts = 30,
  delay = 1000,
) => {
  let i = 0;
  for (i; i < maxAttempts; i++) {
    console.log("attempt", i + 1, " at running script");
    const response = await func();
    if (condition(response)) return response;
    if (i < maxAttempts - 1) sleep(delay);
  }
  console.log(
    "Could not get good response from script in ",
    +maxAttempts + " number of attempts",
  );
  return null;
};

export { retry };
