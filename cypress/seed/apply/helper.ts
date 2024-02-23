import { createHash } from "crypto";

const getUUID = (index = 0, userId = process.env.FIRST_USER_ID) =>
  `${Math.abs(+userId + index)
    .toString()
    .padStart(8, "0")}-0000-0000-0000-000000000000`;

const getTestID = (index = 0) =>
  -(Math.abs(+process.env.FIRST_USER_ID) + index);

const hashApiKey = (apiKey: string) => {
  const hash = createHash("sha512");
  hash.update(apiKey, "utf-8");
  const hashed = hash.digest("hex");

  return hashed;
};

export { getTestID, getUUID, hashApiKey };
