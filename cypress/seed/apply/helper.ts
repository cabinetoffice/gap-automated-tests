import * as crypto from "crypto";
import * as dayjs from "dayjs";

const getUUID = (index = 0) =>
  `${Math.abs(+process.env.FIRST_USER_ID + index)
    .toString()
    .padStart(8, "0")}-0000-0000-0000-000000000000`;

const getTestID = (index = 0) =>
  -(Math.abs(+process.env.FIRST_USER_ID) + index);

const hashApiKey = (apiKey: string) => {
  const hash = crypto.createHash("sha512");
  hash.update(apiKey, "utf-8");
  const hashed = hash.digest("hex");

  return hashed;
};

const generateNowInDbDateAndTimeFormat = () => {
  const now = dayjs();
  return now.format("YYYY-MM-DD HH:mm:ss.SSS");
};
export { getUUID, getTestID, hashApiKey, generateNowInDbDateAndTimeFormat };
