import bcrypt from "bcryptjs";

export const hashValue = async (value: string, salt: number = 13) =>
  await bcrypt.hash(value, salt);

export const compareValue = async (value: string, hashedValue: string) =>
  await bcrypt.compare(value, hashedValue);
