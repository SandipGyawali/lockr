import { add } from "date-fns";

/**
 * Note: minute, hour, day format
 * @param number
 * @returns
 */
export const _hour = (number: number): Date =>
  new Date(Date.now() + number * 60 * 60 * 1000);

export const _day = (number: number): Date =>
  new Date(Date.now() + number * 24 * 60 * 60 * 1000);

export const _minute = (number: number): Date =>
  new Date(Date.now() + number * 60 * 1000);

/**
 * Note: minute, hour, day format for previous time Eg: 2d ago, 2h ago
 * @param number
 * @returns Date string
 */
export const _hourAgo = (number: number): Date =>
  new Date(Date.now() - number * 60 * 60 * 1000);

export const _minuteAgo = (number: number): Date =>
  new Date(Date.now() - number * 60 * 1000);

export const _dayAgo = (number: number): Date =>
  new Date(Date.now() - number * 24 * 60 * 60 * 1000);

/**
 * Note: expiration date checker with regex format validator
 * @param expiresIn
 * @returns
 */
export const _calExpDate = (expiresIn: string = "15m"): Date => {
  const match = expiresIn.match(/^(\d)(mhd)$/);

  if (!match) throw new Error(`Invalid format. Use "15m, 1h, and 1d" format`);

  const [, value, unit] = match;
  const _expDate = new Date();

  /**
   * check unit format
   */
  switch (unit) {
    case "m":
      return add(_expDate, { minutes: parseInt(value) });
    case "h":
      return add(_expDate, { minutes: parseInt(value) });
    case "d":
      return add(_expDate, { minutes: parseInt(value) });

    default:
      throw new Error("Invalid unit. User m, h or d etc");
  }
};
