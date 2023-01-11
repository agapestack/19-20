//  _____________________KULAMI GLOBAL CONFIG_____________________

import { NumberLiteralType } from "typescript";

export const BOARD_EMPTY_VALUE = -1;
export const SQUARE_PLAYED_VALUE = 1;

export const RED = 1;
export const BLACK = 2;

export const kulamiConfig = {
  nbColumn: 10,
  nbRow: 10,
  nbTotalRedPawn: 28,
  nbTotalBlackPawn: 28,
  nbTotalTiles: 17,
  nbTile_2box: 4,
  nbTile_3box: 4,
  nbTile_4box: 5,
  nbTile_6box: 4,
};

//  _____________________TILE TYPES_____________________
export type TileType = "2-2" | "3-1" | "1-3" | "2-3" | "3-2" | "1-2" | "2-1";

export const tileTypes = {
  tile_1x2: "1-2" as TileType,
  tile_2x2: "2-2" as TileType,
  tile_3x1: "3-1" as TileType,
  tile_1x3: "1-3" as TileType,
  tile_2x3: "2-3" as TileType,
  tile_3x2: "3-2" as TileType,
  tile_2x1: "2-1" as TileType,
};

//  _____________________DATA MANAGMENT INTERFACES_____________________

export interface TileDataInterface {
  tileType: TileType;
  tilePos: string;
  color: string;
  posList: number[][];
}

export interface PositionDataInterface {
    posX: number;
    posY: number;
    player: number;
}

export type KULAMI_MENU = "MENU_MAPPING" | "MENU_PLAY";

export const kulamiMenuObject = {
  MENU_MAPPING: "MENU_MAPPING" as KULAMI_MENU,
  MENU_PLAY: "MENU_PLAY" as KULAMI_MENU,

};

export interface KulamiStateInterface {
  // MAPPING
  menu: KULAMI_MENU;
  boardTileArray: number[][];
  selectedTile: TileType | null;
  tileStack: TileDataInterface[];
  nbTile: number;
  nbTile2Toltal: number;
  nbTile3Toltal: number;
  nbTile4Toltal: number;
  nbTile6Toltal: number;
  
  // PLAY MODE
  player: number;
  nbRedPawn: number;
  nbBlackPawn: number;
  status: GAME_STATUS;
  boardPawnArray: number[][];
  placedTile: TileType | null;
  positionStack: PositionDataInterface[];
  redScore: number;
  blackScore: number;
}

export type GAME_STATUS = "IN_PROGRESS" | "RED_WINS" | "BLACK_WINS";

export const gameStatusObject = {
  IN_PROGRESS: "IN_PROGRESS" as GAME_STATUS,
  RED_WINS: "RED_WINS" as GAME_STATUS,
  BLACK_WINS: "BLACK_WINS" as GAME_STATUS,
};
