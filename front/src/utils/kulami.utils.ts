import {
  BOARD_EMPTY_VALUE,
  kulamiConfig,
  TileType,
} from "../config/kulami.config";

// Get [width,height] from selectedTile (kulami state)
export const extractTileSize = (tile: TileType): number[] => {
  return [Number(tile[0]), Number(tile[2])];
};

// verify that tile is next to another on board
export const isTileNextToAnother = (
  posX: number,
  posY: number,
  width: number,
  height: number,
  board: number[][]
) => {
  // top
  if (posY - 1 >= 0) {
    for (let i = 0; i < width; i++) {
      // console.log(posX + i, posY - 1);
      if (board[posX + i][posY - 1] !== BOARD_EMPTY_VALUE) {
        return true;
      }
    }
  }

  // bottom
  if (posY + 1 + width < kulamiConfig.nbColumn) {
    for (let i = 0; i < width; i++) {
      // console.log(posX + i, posY + height);
      if (board[posX + i][posY + height] !== BOARD_EMPTY_VALUE) {
        return true;
      }
    }
  }
  // right
  if (posX + width < kulamiConfig.nbRow) {
    for (let i = 0; i < height; i++) {
      // console.log(posX + width, posY + i);
      if (board[posX + width][posY + i] !== BOARD_EMPTY_VALUE) {
        return true;
      }
    }
  }

  // left
  if (posX - 1 >= 0) {
    for (let i = 0; i < height; i++) {
      // console.log(posX - 1, posY + i);
      if (board[posX - 1][posY + i] !== BOARD_EMPTY_VALUE) {
        return true;
      }
    }
  }

  return false;
};
