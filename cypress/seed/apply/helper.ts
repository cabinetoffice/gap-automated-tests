const getUUID = (index = 0) =>
  `${Math.abs(+process.env.FIRST_USER_ID + index)
    .toString()
    .padStart(8, "0")}-0000-0000-0000-000000000000`;

const getTestID = (index = 0) =>
  -(Math.abs(+process.env.FIRST_USER_ID) + index);

function sleep(milliseconds: number) {
  const start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

const retry = async (
  func: any,
  condition: { (response: { status: string }): boolean; (arg0: any): any },
  maxAttempts = 30,
  delay = 1000,
) => {
  let i = 0;
  for (i; i < maxAttempts; i++) {
    console.log("attempt", i, " at running script");
    const response = await func();
    console.log(response[0][0]);
    if (condition(response)) return response;
    if (i < maxAttempts - 1) sleep(delay);
  }
  console.log(
    "Could not get good response from script in ",
    +maxAttempts + " number of attempts",
  );
  return null;
};

export { getUUID, getTestID, retry };
