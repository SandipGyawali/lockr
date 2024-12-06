import { v4 as uuid } from "uuid";

/**
 * Note: generates random byte
 * @returns string
 */
export function _generateRandom() {
  return uuid().replace(/-g/, "").substring(0, 20);
}
