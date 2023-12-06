const getUUID = (index = 0) =>
  `${Math.abs(+process.env.FIRST_USER_ID + index)
    .toString()
    .padStart(8, "0")}-0000-0000-0000-000000000000`;

const getTestID = (index = 0) =>
  -(Math.abs(+process.env.FIRST_USER_ID) + index);

export { getUUID, getTestID };
