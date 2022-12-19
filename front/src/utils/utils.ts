import randomColor from "randomcolor";
import { kulamiConfig } from "../config/kulami.config";

export const generateRandomString = (length: number): string => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const tileColorArrayGenerator = () => {
  let res = [];
  for (let i = 0; i < kulamiConfig.nbTotalTiles; i++) {
    res.push(randomColor());
  }

  return res;
};

export const tileColorArray = tileColorArrayGenerator()



